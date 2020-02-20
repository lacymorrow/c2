'use strict'

import debounce from 'lodash/debounce'
import ky from 'ky-universal'
import movieInfo from 'movie-info'
import movieTrailer from 'movie-trailer'
import omdbApi from 'omdb-client'
import queue from 'queue'

import config from '../config'
import ipc from './safe-ipc'
import { log, epoch } from './util'
import {
	indexGenre,
	indexMovieGenre,
	getMovies,
	getState,
	setState,
	getMovieById,
	updateMovie,
	resetGenres,
	refreshMovieCache
} from './database'

/* Trigger a UI reflow */
const renderUpdate = ( command, data ) => {

	// Accepts {command: '', data:'...'} or as args
	if ( typeof command === 'object' ) {

		data = command.data
		command = command.command

	}

	console.log( `UPDATE: ${command}` )
	ipc.send( 'for-renderer', { command, data } )

}

// Debounced reflow triggers
const _refreshGenres = () => {

	const movies = getMovies()
	renderUpdate( 'genres', movies )

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

const _refreshState = () => {

	const movies = getMovies()
	renderUpdate( 'movies', movies )

}

export const refreshState = debounce( _refreshState, config.REFLOW_DELAY, {
	maxWait: config.REFLOW_DELAY,
	leading: true,
	trailing: true
} )

// TODO Warn user if this will take awhile

// Create and start queue
const q = queue( {
	autostart: true,
	concurrency: config.MAX_CONNECTIONS,
	timeout: 5000,
	results: []
} )

// On every job finish
q.on( 'success', () => {

	// Change loading bar when queue updates
	const { queueTotal } = getState()
	setState( { loading: Math.round( ( q.length / queueTotal ) * 100 ) || 0 } )
	refreshMovies()

} )

q.on( 'end', () => {

	log( 'Services queue completed.' )
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

		}

		setState( { cachedGenresTime: epoch() } )

	} catch ( error ) {

		throw new Error( `Cinematic/initGenreCache: ${error}` )

	}

}

export const fetchMeta = ( mid, name, year ) => {

	const { queueTotal } = getState()
	setState( { queueTotal: queueTotal + 3 } )

	// Queue API calls
	q.push( () => {

		return fetchOMDB( name )
			.then( res => {

				return reconcileMovieMeta( mid, res )

			} )
			.catch( error => {

				return log( `Error fetching OMDB meta: ${error}` )

			} )

	} )

	q.push( () => {

		return fetchTMDB( name, year )
			.then( res => {

				// Add movie genres
				for ( const gid of res.genre_ids ) {

					indexMovieGenre( gid, mid )

				}

				return reconcileMovieMeta( mid, res )

			} )
			.catch( error => {

				return log( `Error fetching TMDB meta: ${error}` )

			} )

	} )

	q.push( () => {

		return fetchTrailer( name, year ).then( res => {

			const movie = getMovieById( mid )
			if ( movie ) {

				movie.trailer = res

			}

			updateMovie( mid, movie )

			return res

		} )
		// .catch(error => {
		// 	return log(`Error fetching trailer meta: ${error}`)
		// })

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

const fetchTMDB = ( name, year ) => {

	return movieInfo( name, year ).then( res => {

		res.ratings = []

		if ( res.vote_average ) {

			res.ratings.push( {
				name: 'TMDB',
				score: parseFloat( res.vote_average ),
				count: countToArray( res.vote_average )
			} )

		}

		res.plot = res.overview
		res.releaseDate = Date.parse( res.release_date )
		res.year = res.Year

		res.backdrop =
			config.IMDB_ENDPOINT + config.BACKDROP_SIZE + res.backdrop_path
		res.poster = config.IMDB_ENDPOINT + config.POSTER_SIZE + res.poster_path

		const keys = Object.keys( res )
		res.info = {}

		for ( const key of keys ) {

			res.info[key] = res[key]

		}

		return res

	} )

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
