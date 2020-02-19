'use strict'

import Store from 'electron-store'
import config from '../config'
import ipc from './safe-ipc'
import {renderUpdate} from './services'
import {epoch} from './util'

const store = new Store({
	defaults: {
		state: {},
		cache: [],
		genres: [],
		movies: [],
		recent: [],
		watched: []
	}
})

/* State */
export const initState = options => {
	store.set('state', config.DEFAULT_STATE)
}

export const getState = () => store.get('state')

export const setState = options => {
	const state = getState()
	store.set('state', {...state, ...options})
	renderUpdate('state', options)
}

/* Recent */
export const addRecent = mid => {
	const time = epoch()

	const recent = store.get('recent')
	recent.unshift({_id: mid, time})
	store.set('recent', recent)

	updateMovie(mid, {recentTime: time})
}

/* Watched */
export const addWatched = mid => {
	const time = epoch()

	const watched = store.get('watched')
	watched.unshift({_id: mid, time})
	store.set('watched', watched)

	updateMovie(mid, {watchedTime: time})
}

/* Genre */
export const indexGenre = (id, name) => {
	// Create or update genre name
	const genre = getGenre(id)
	if (genre) {
		updateGenre(id, {name})
	} else {
		addGenre(id, {name})
	}
}

export const indexMovieGenre = (id, mid) => {
	// Create or update genre and pin a movie to genre
	const genre = getGenre(id)
	if (genre) {
		// Genre is not guaranteed to have .items
		const items = genre.items || []
		items.push(mid)
		updateGenre(id, {items})
	}
}

const addGenre = (id, options) => {
	const genre = {...options,  ...{id, _id: id.toString(), items:[]} }
	const genres = store.get('genres')
	genres.push(genre)
	store.set('genres', genres)
}

export const getGenres = () => store.get('genres')

const getGenre = id => {
	const genres = store.get('genres')
	for (const genre of genres) {
		if (genre._id === id.toString()) {
			return genre
		}
	}

	return false
}

const updateGenre = (id, options) => {
	const genres = store.get('genres')
	genres.forEach((genre, i) => {
		if (genre._id === id.toString()) { // id is a number
			genre = {...genre, ...options}
			genres[i] = genre
			store.set('genres', genres)
		}
	})
	refreshGenres()
}

export const resetGenres = () => {
	store.set('genres', [])
}

/* Movies */
export const addMovie = movie => {
	const movies = store.get('movies')
	movies.push(movie)
	store.set('movies', movies)

	return movie._id
}

export const getMovies = () => {
	return store.get('movies')
}

export const getMovieById = mid => {
	const movies = store.get('movies')
	console.log(movies)
	for (const movie of movies) {
		if (movie._id === mid) {
			return movie
		}

	}

	return false
}

export const getMovieByFile = file => {
	const movies = store.get('movies')
	for (const movie of movies) {
		if (movie.file === file) {
			return movie
		}
	}

	return false
}

export const updateMovie = (mid, options) => {
	const movies = store.get('movies')
	movies.forEach((movie, i) => {
		if (movie._id === mid) {
			movie = {...movie, ...options}
			movies[i] = movie
			store.set('movies', movies)
		}
	})
}

export const updateMovieTrailer = (mid, trailer) => {
	const movies = store.get('movies')
	movies.forEach((movie, i) => {
		if (movie._id === mid) {
			movie.trailer = trailer
			movies[i] = movie
			store.set('movies', movies)
		}
	})
}

export const randomizeMovies = () => {
	const movies = store.get('movies')
	for (const movie of movies) {
		updateMovie(movie._id, {seed: Math.random()})
	}
}

export const resetMovies = () => {
	return store.set('movies', [])
}

/* Cache */
const addCachedMovie = movie => {
	const cache = store.get('cache')
	cache.push(movie)
	store.set('cache', cache)
}

const updateCachedMovie = (key, movie) => {
	const cache = store.get('cache')
	cache.unshift({_id: key, cached_at: epoch(), movie})
	store.set('cache', cache)
}

export const getCachedMovie = key => {
	const cache = store.get('cache')
	for (const c of cache) {
		if (c._id === key) {
			return c
		}
	}

	return false
}

export const cacheMovie = file => {
	const movie = getMovieByFile(file)
	movie.cached_at = epoch()
	// Only cache if it loaded properly
	if (movie && movie.intel.Title && movie.info.title) {
		addCachedMovie(movie)
	}
}

export const getMoviesCache = () => {
	const cache = store.get('cache')
	return cache
}

export const refreshMovieCache = () => {
	const movies = getMovies()
	const time = epoch()
	movies.forEach(movie => {
		updateCachedMovie(movie.path + movie.file, movie)
	})
	setState({cached_movies_at: time})
}

/* DB */
export const resetDB = () => {
	store.reset()
	return true
}
