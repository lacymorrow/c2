'use strict'

import logger from 'electron-timber'
import debounce from 'lodash/debounce'
import ky from 'ky-universal'
import movieInfo from 'movie-info'
import movieTrailer from 'movie-trailer'
import omdbApi from 'omdb-client'
import queue from 'queue'

import config from '../config'
import ipc from './safe-ipc'
import strings from './strings'
import { log, epoch } from './util'
import {
	indexGenre,
	indexMovieGenre,
	getGenres,
	getMovies,
	getState,
	setState,
	syncState,
	getMovieById,
	updateMovie,
	resetGenres,
	refreshMovieCache
} from './database'

export const serviceLog = logger.create( { name: 'service' } )

/* IPC Communication */
export const setupIPC = () => {

	// If message is received, pass it back to the renderer via the main thread
	ipc.on( 'to-worker', ( event, arg ) => {

		const { command, data } = arg
		switch ( command ) {

			case 'sync':
				syncState( data )
				break
			case 'message':
				log( data )
				break
			default:
				log( `${strings.ipc.invalid}: ${arg}` )
				break

		}

	} )

}

/* Trigger a UI reflow */
const renderUpdate = ( command, data ) => {

	// Accepts {command: '', data:'...'} or as args
	if ( typeof command === 'object' ) {

		data = command.data
		command = command.command

	}

	// Log( `<<<UPDATE>>>: ${command} - ${JSON.stringify( data )}` )
	ipc.send( 'for-renderer', { command, data } )

}

// Debounced reflow triggers
const _refreshGenres = () => {

	const genres = getGenres()
	renderUpdate( 'genres', genres )

}

export const refreshGenres = debounce( _refreshGenres, config.REFLOW_DELAY, {
	maxWait: config.REFLOW_DELAY,
	leading: true,
	trailing: true
} )

const _refreshMovies = () => {

	const movies = getMovies()
	renderUpdate( 'movies', movies )

}

export const refreshMovies = debounce( _refreshMovies, config.REFLOW_DELAY, {
	maxWait: config.REFLOW_DELAY,
	leading: true,
	trailing: true
} )

export const refreshState = () => {

	const state = getState()
	renderUpdate( 'state', state )

}

// TODO Warn user if this will take awhile
// TODO test bad/no internet

/* QUEUE */
const q = queue( {
	autostart: true,
	concurrency: config.MAX_CONNECTIONS,
	timeout: config.TIMEOUT,
	results: []
} )

const qUpdateLoadingBar = () => {

	// Change loading bar when queue updates
	const { queueTotal } = getState()
	setState( { loading: Math.round( ( q.length / queueTotal ) * 100 ) || 0 } )

}

q.on( 'start', () => {

	log( strings.q.start )
	qUpdateLoadingBar()

} )

q.on( 'success', () => {

	qUpdateLoadingBar()
	refreshMovies()

} )

q.on( 'error', error => {

	log( `${strings.q.error}: ${error}` )
	qUpdateLoadingBar()

} )

q.on( 'timeout', ( next, job ) => {

	log( `${strings.q.timeout}: ${job}` )
	qUpdateLoadingBar()
	next()

} )

q.on( 'end', error => {

	if ( error ) {

		log( `${strings.q.error}: ${error}` )

	}

	log( strings.q.finish )

	setState( { loading: 0 } )
	if ( config.CACHE_TIMEOUT ) {

		refreshMovieCache()

	}

	refreshMovies()

} )

export const resetQueue = () => {

	q.end()

}

export const initGenreCache = async () => {

	resetGenres()
	try {

		const response = await ky(
			`${config.GENRE_ENDPOINT}?api_key=${config.TMDB_KEY}`
		)
		const res = await response.json()

		for ( const genre of res.genres ) {

			indexGenre( genre.id, genre.name )
			// console.log(genre.id, genre.name)

		}

		setState( { cachedGenresTime: epoch() } )

	} catch ( error ) {

		throw new Error( `initGenreCache/ ${strings.error.genres}: ${error}` )

	}

}

export const fetchMeta = ( mid, name, year ) => {

	const { queueTotal } = getState()
	setState( { queueTotal: queueTotal + 3 } )

	// Queue API calls
	q.push( async () => {

		try {

			const response = await fetchOMDB( name )

			return reconcileMovieMeta( mid, response )

		} catch ( error ) {

			return log( `${strings.error.omdb}: ${error}` )

		}

	} )

	q.push( async () => {

		try {

			const response = await fetchTMDB( name, year )
			// Add movie genres
			for ( const gid of response.genre_ids ) {

				indexMovieGenre( gid, mid )

			}

			return reconcileMovieMeta( mid, response )

		} catch ( error ) {

			return log( `${strings.error.tmdb}: ${error}` )

		}

	} )

	q.push( async () => {

		try {

			const response = await fetchTrailer( name, year )
			const movie = getMovieById( mid )

			if ( movie ) {

				movie.trailer = response

			}

			updateMovie( mid, movie )

			return response

		} catch ( error ) {

			return log( `${strings.error.trailer}: ${error}` )

		}

	} )

}

const fetchOMDB = name => {

	return new Promise( ( resolve, reject ) => {

		omdbApi.get(
			{
				apiKey: config.OMDB_KEY,
				title: name,
				plot: config.PLOT_LENGTH === 'short' ? 'short' : 'full'
			},
			async ( error, res ) => {

				// Process meta
				if ( error && !res ) {

					return reject( error )

				}

				// Toss any "N/A" response
				for ( const key of Object.keys( res ) ) {

					if ( res[key] === 'N/A' ) {

						res[key] = null

					}

				}

				// Strip runtime non-digit characters
				res.runtime = parseInt(
					res.Runtime && res.Runtime.replace( /\D/g, '' ),
					10
				)
				res.poster = res.Poster
				res.year = res.Year
				res.imdbId = res.imdbID
				res.plot = res.Plot
				res.poster = res.Poster
				res.releaseDate = Date.parse( res.Released )
				res.title = res.Title
				res.ratings = []

				// TODO Remove this unless it actually helps
				// Arrays of the ratings :|
				if ( res.imdbRating ) {

					res.ratings.push( {
						name: 'IMDB',
						score: parseFloat( res.imdbRating ),
						count: countToArray( res.imdbRating )
					} )

				}

				if ( res.Metascore ) {

					res.ratings.push( {
						name: 'Metascore',
						score: res.Metascore / 10,
						count: countToArray( res.Metascore / 10 )
					} )

				}

				const keys = Object.keys( res )
				res.intel = {}
				for ( const key of keys ) {

					res.intel[key] = res[key]

				}

				return resolve( res )

			}
		)

	} )

}

const fetchTMDB = async ( name, year ) => {

	const response = await movieInfo( name, year )

	response.ratings = []

	if ( response.vote_average ) {

		response.ratings.push( {
			name: 'TMDB',
			score: parseFloat( response.vote_average ),
			count: countToArray( response.vote_average )
		} )

	}

	response.plot = response.overview
	response.releaseDate = Date.parse( response.release_date )
	response.year = response.Year

	response.backdrop =
		config.IMDB_ENDPOINT + config.BACKDROP_SIZE + response.backdrop_path
	response.poster = config.IMDB_ENDPOINT + config.POSTER_SIZE + response.poster_path

	const keys = Object.keys( response )
	response.info = {}

	for ( const key of keys ) {

		response.info[key] = response[key]

	}

	return response

}

const fetchTrailer = ( name, year ) => {

	return movieTrailer( name, {
		year,
		id: true,
		multi: true
	} )

}

const countToArray = num => {

	// Create an array of empty elements with length n
	return new Array( Math.round( num ) ).map( () => {

		return {}

	} )

}

const reconcileMovieMeta = ( mid, meta ) => {

	const movie = getMovieById( mid )
	if ( movie ) {

		// Merge objects and preserve: plot, poster, releaseDate, year
		Object.assign(
			movie,
			meta,
			{ ratings: [ ...movie.ratings, ...meta.ratings ] },
			{ plot: movie.plot || meta.plot },
			{ poster: movie.poster || meta.poster },
			{ releaseDate: movie.releaseDate || meta.releaseDate },
			{ year: movie.year || meta.year }
		)
		updateMovie( mid, movie )

		return movie

	}

	return meta

}
