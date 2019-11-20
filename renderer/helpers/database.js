'use strict'

import Store from 'electron-store'
import {epoch} from './util'

// if (!process.browser) {
// const Store = require('electron-store')
// }
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

// export const Genres = new Mongo.Collection('genres')
// export const Movies = new Mongo.Collection('movies')
// export const MovieCache = new Mongo.Collection('movieCache')
// export const State = new Mongo.Collection('state')
// export const Recent = new Mongo.Collection('recent')
// export const Watched = new Mongo.Collection('watched')

/* State */
export const initState = options => {
	const defaults = {
		_id: '0', // There can be only one...
		cwd: process.env.PWD, // electron.remote.app.getPath()
		dir: '~/',
		loading: 100,
		queueTotal: 0
	}

	store.set('state', defaults)
}

export const getState = () => store.get('state')

export const setState = options => store.set('state', options)

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
	} else {
		addGenre(id, {name, items: [mid]})
	}
}

const addGenre = (id, options) => {
	const genre = Object.assign({...options}, {_id: id.toString(), id})
	const genres = store.get('genres')
	genres.push(genre)
	store.set('genres', genres)
}

const getGenre = id => {
	const genres = store.get('genres')
	genres.forEach(genre => {
		if (genre._id === id.toString()) {
			return genre
		}
	})

	return undefined
}


const updateGenre = (id, options) => {
	const genres = store.get('genres')
	genres.forEach((genre, i) => {
		if (genre._id === id.toString()) {
			genre = Object.assign(genre, {...options})
			genres[i].genre = genre
			store.set('genres', genres)
		}
	})

}

export const resetGenres = () => {
	store.set('genres', [])
}

/* Movies */
export const addMovie = movie => {
	const movies = store.get('movies')
	movies.push(movie)
	store.set('movies', movies)
}

export const getMovies = () => {
	return store.get('movies')
}

export const getMovieById = mid => {
	const movies = store.get('movies')
	movies.forEach(movie => {
		if (movie._id === mid) {
			return movie
		}
	})

	return undefined
}

export const getMovieByFile = file => {
	const movies = store.get('movies')
	movies.forEach(movie => {
		if (movie.file === file) {
			return movie
		}
	})

	return undefined
}

export const updateMovie = (mid, options) => {
	const movies = store.get('movies')
	movies.forEach((movie, i) => {
		if (movie._id === mid) {
			movie = Object.assign(movie, {...options})
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
	// const seeds = Movies.find({}, {fields: {seed: 1}})
	// seeds.forEach(seed => {
	// 	updateMovie(seed._id, {$set: {seed: Math.random()}})
	// })
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
	cache.forEach(c => {
		if (c._id === key) {
			return c
		}
	})

	return undefined
}

export const cacheMovie = file => {
	const movie = getMovieByFile(file)
	movie.cached_at = epoch()
	// Only cache if it loaded properly
	if (movie && movie.intel.Title && movie.info.title) {
		addCachedMovie(movie)
	}
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
