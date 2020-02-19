'use strict'

import fs from 'fs'
import path from 'path'

import open from 'open'
import parseTorrentName from 'parse-torrent-name'

import config from './config'
import {defaultMovieMeta, movieTitlePattern} from './constants'
import {getOSMediaPath, isDirectory} from './fs'
import {broadcast, epoch, hash, ignorePattern, isDigit, prettyName} from './util'
import {fetchMeta, initGenreCache, resetQueue} from './services'
import {
	initState,
	getState,
	setState,

	addMovie,
	addRecent,
	addWatched,

	getCachedMovie,
	getMoviesCache,
	indexMovieGenre,

	randomizeMovies,
	resetMovies,
	resetDB
} from './database'

export const start = () => {
	const state = getState()
	initState() // TODO -- resets on boot

	let dirpath;

	if (state.dirpath) {
		// Cinematic has been run before

		// Reload movies DB
		getMoviesCache()

		// Scan path anyway to verify real-time
		dirpath = state.dirpath

		// If genre cache is expired, update genres
		if (
			!config.CACHE_TIMEOUT ||
					!state.genreCacheTimestamp ||
					!(epoch() < state.genreCacheTimestamp + config.CACHE_TIMEOUT)
		) {
			broadcast('Cinematic: Cache invalid. Fetching genres for cache.')
			initGenreCache()
		}
	} else {
		// First run
		broadcast('Starting Cinematic...')
		initState()
		initGenreCache()

		// Set path from os, fallback to config or root
		dirpath = getOSMediaPath() || config.DEFAULT_MEDIA_PATH || '/'
	}

	// Reset fleeting state
	setState({queueTotal: 0})

	// Trigger a reload of data
	setPath(dirpath)
}

const setPath = (dirpath) => {

	// Save dirpath
	setState({
		dir: dirpath,
		dirpath // migrating to use this variable
	})

	// Scan files
	scanPath()
}

const scanPath = () => {
	const {dirpath} = getState()
	if (isDirectory(dirpath)) {
		setState({dirpath, queueTotal: 0}) // TODO scanPath called to update dirpath, break out
		resetMovies()
		scanDir(dirpath, 0)
	} else {
		broadcast('Error: Path is not a directory.')
	}
}

const scanDir = (dirpath, recurseDepth) => {
	// Read from filesystem
	try {
		const files = fs.readdirSync(dirpath)
		files.forEach(file => {
			const ext = path.extname(file)
			const filepath = path.join(dirpath, file)

			if (file.indexOf('.') === 0) {
				// Skip dotfiles
				return false
			}

			if (ext) {
				// File
				if (config.VALID_FILETYPES.includes(ext)) {
					scanFile(filepath)
				} else {
					broadcast(`Warning: File ${file} not valid.`)
				}
			} else if (isDirectory(filepath) && recurseDepth < config.SCAN_DEPTH) {
				scanDir(path.join(filepath, '/'), recurseDepth + 1)
			}
		}) // End file scan forEach
	} catch (error) {
		broadcast(`Error scanning directory ${dirpath}: ${error}`)
	}
}

const scanFile = filepath => {
	const file = path.basename(filepath)
	const ext = path.extname(filepath)
	const {name, year} = parseFilename(path.basename(file, ext))

	if (name !== ext && !ignorePattern(name)) {
		const movc = getCachedMovie(filepath)
		if (
			movc &&
						config.CACHE_TIMEOUT &&
						epoch() < movc.cached_at + config.CACHE_TIMEOUT
		) {
			// Cached
			broadcast(`Loading cached movie ${name}`)
			addMovie(movc.movie)
			movc.movie.info.genre_ids.forEach(e => {
				indexMovieGenre(e, movc.movie._id)
			})
		} else {
			// Not cached
			const movie = Object.assign(defaultMovieMeta, {
				ext,
				file,
				name,
				filepath,
				year,
				_id: hash(filepath),
				releaseDate: year,
				title: name
			})

			const mid = addMovie(movie)

			// Make api calls to gather info
			fetchMeta(mid, name, year)
		}
	}
}

const openFile = filepath => {
	open(path.join('file://', filepath))
}

const parseFilename = filename => {
	const meta = {name: filename, year: null}
	switch (config.PARSE_METHOD) {
		case 'regex': {
			const match = movieTitlePattern.exec(filename)
			if (match) {
				meta.name = unescape(match[1])
				if (match.length > 1 && isDigit(match[3])) {
					meta.year = match[3]
				}
			}

			break
		}

		case 'parse':
		default: {
			if (filename === '.') {
				return
			}

			const parsedMeta = parseTorrentName(filename)
			Object.assign(meta, {
				name: prettyName(parsedMeta.title),
				year: parsedMeta.year || null
			})

			break
		}
	}

	return meta
}

const reset = () => {
	// Reset and init state
	broadcast('Resetting server...')
	resetDB()
	resetQueue()

	// Restart
	start()
}

// // Server-side methods exposed to the client
// Meteor.methods({
// 	handleBrowseDialog(files) {
// 		// Receives an array of filenames
// 		files.forEach(e => {
// 			scanFile(e.name)
// 		})
// 	},
// 	handleConfirmPath(dirPath) {
// 		// Add trailing slash
// 		dirPath += dirPath.slice(-1) === '/' ? '' : '/'
//
// 		// Set new dir
// 		setState({dir: path.normalize(dirPath)})
// 		scanPath()
// 	},
// 	handleOpenFile(fileObj) {
// 		broadcast('Opening ' + fileObj.filepath)
// 		addWatched(fileObj.mid)
// 		openFile(fileObj.filepath)
// 	},
// 	handleRandomSort() {
// 		randomizeMovies()
// 	},
// 	handleRefresh() {
// 		reset()
// 	},
// 	handleViewMovie(mid) {
// 		addRecent(mid)
// 	}
// })
