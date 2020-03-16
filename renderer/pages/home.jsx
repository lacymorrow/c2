import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import { ThemeProvider } from 'styled-components'
import { FiShuffle } from 'react-icons/fi'

import config from '../config'
import strings from '../helpers/strings'

import { GlobalStyle } from '../styled/global'
import { dark, light } from '../styled/themes'
import { ContainerX, HeaderX, MainX, DisplayX, ShuffleButtonX } from '../styled/home'

// Import { getMovieById } from '../helpers/database'
import ipc, { randomizeMovies, syncState } from '../helpers/safe-ipc'
import { getElByKeyValue, isPageVsGenreId } from '../helpers/util'

import Directory from '../components/directory'
import Sort from '../components/sort'
import Messagebox from '../components/messagebox'
import MovieInfo from '../components/movie-info'
import MovieList from '../components/movie-list'
import Progress from '../components/progress'
import ResetButton from '../components/reset-button'
import Sidebar from '../components/sidebar'
import ThemeToggle from '../components/theme-toggle'

// TODO addRecent, addWatched, randomizeMovies, reset, open

const Home = () => {

	// TODO - set initial state from electron store vals

	// State defaults
	const [ message, setMessage ] = useState( strings.messagebox.init )
	const [ movies, setMovies ] = useState( [] )
	const [ genres, setGenres ] = useState( [] )

	const [ currentMovie, setCurrentMovie ] = useState( {} )
	const [ currentSort, setCurrentSort ] = useState( '' )
	const [ currentPage, setCurrentPage ] = useState( config.DEFAULT_STATE.currentPage )
	const [ currentTheme, setCurrentTheme ] = useState( light )

	const [ state, setState ] = useState( config.DEFAULT_STATE )

	// Const stateRef = useRef( state )
	// stateRef.current = state

	// State properties
	const { dirpath, loading, working } = state

	// Merge state
	const assignState = newState => {

		setState( prevState => {

			return { ...prevState, ...newState }

		} )

	}

	/* HANDLERS */
	const onChangeDirectory = dirpath => {

		// Set new directory
		assignState( { dirpath } )
		syncState( { dirpath } )

	}

	const onChangeSort = sort => {

		setCurrentSort( sort )

	}

	const onChangePage = page => {

		if ( isPageVsGenreId( page ) ) {

			setCurrentPage( page )

		} else {

			for ( const genre of genres ) {

				if ( genre._id === page.toString() ) {

					setCurrentPage( genre._id )

				}

			}

		}

	}

	const onChangeTheme = () => setCurrentTheme( theme => {

		// Todo save theme and reload
		if ( theme === light ) {

			return dark

		}

		return light

	} )

	const onChangeCurrentMovie = mid => {

		const movie = getElByKeyValue( movies, '_id', mid )
		setCurrentMovie( movie )

	}

	const onClickResetButton = () => {

		console.log( strings.resetBtn.click )
		syncState() // Send state back to worker

	}

	const onClickShuffleButton = () => randomizeMovies()

	const getOrganizedMovieList = () => {

		// Filter
		const paged = movies.filter( movie => {

			switch ( currentPage ) {

				case config.DEFAULT_STATE.currentPage:
					// Main (all)
					return true // No break needed

				default:
					// Filter genres
					return movie.genre_ids && movie.genre_ids.includes( parseInt( currentPage, 10 ) ) // No break needed

			}

		} )

		// Sort
		switch ( currentSort ) {

			case 'popularity':
				paged.sort( ( x, y ) => y.popularity - x.popularity )
				break
			case 'ratings':
				// IMDB Rating
				paged.sort( ( x, y ) => parseFloat( y.imdbRating ) - parseFloat( x.imdbRating ) )
				break
			case 'release':
				// Release date
				paged.sort( ( x, y ) => parseInt( y.releaseDate, 10 ) - parseInt( x.releaseDate, 10 ) )
				break
			case 'runtime':
				// Runtime
				paged.sort( ( x, y ) => x.runtime - y.runtime )
				break
			case 'shuffled':
				paged.sort( ( x, y ) => x.seed - y.seed )
				break
			case 'alphabetical':
			default:
				// Title
				paged.sort( ( x, y ) => x.name.localeCompare( y.name ) )
				break

		}

		return paged

	}

	/* State Effect Functions */

	// State change callback
	useEffect( () => {

		console.log( state.loading )

	}, [ state ] )

	// Setup and tear-down communication
	useEffect( () => {

		// Depends on [], so never re-run
		// componentDidMount()
		// register ipc events
		ipc.on( 'to-renderer', ( event, arg ) => {

			if ( typeof arg === 'object' ) {

				const { command, data } = arg
				switch ( command ) {

					case 'message':
						setMessage( data )
						break
					case 'genres':
						// Sort alphabetically
						setGenres( data.sort( ( x, y ) => x.name && x.name.localeCompare( y.name ) ) )
						break
					case 'movies':
						setMovies( data )
						break
					case 'state':
						assignState( data )
						break
					default:
						console.log( `${strings.error.ipc}: ${arg}` )
						break

				}

			} else {

				setMessage( arg )

			}

		} )

		// Send values back to worker for store (dirpath mainly)
		syncState()

		return () => {

			// ComponentWillUnmount()
			// Unregister things
			ipc.removeAllListeners( 'to-renderer' )

		}

	}, [] )

	// Const organizedMovieList = getOrganizedMovieList(movies)

	/* Template */

	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle/>
			<Head>
				<title>Home - Nextron (ipc-communication)</title>
			</Head>
			<Progress data={loading}/>
			<ContainerX>
				<HeaderX>
					<Directory
						data={dirpath}
						handleChange={onChangeDirectory}
					/>

					<Messagebox data={message}/>
					Loading: {loading}

					<ThemeToggle isActive={currentTheme === light} handleChange={onChangeTheme}/>
					<ResetButton handleChange={onClickResetButton}/>
					{working && 'working'}
				</HeaderX>

				<MainX>
					<Sidebar current={currentPage} data={genres} handleChange={onChangePage} movieCount={movies.length}/>

					<DisplayX>
						<Sort current={currentSort} data={config.FILTERS} handleChange={onChangeSort}/>
						{currentSort === 'shuffled' && (
							<ShuffleButtonX data="shuffle" handleChange={onClickShuffleButton}><FiShuffle/></ShuffleButtonX>
						)}

						<MovieList current={currentMovie._id} data={getOrganizedMovieList()} handleChange={onChangeCurrentMovie}/>
					</DisplayX>

					<MovieInfo data={currentMovie}/>

				</MainX>
				{/* <Refresh /> */}
			</ContainerX>
		</ThemeProvider>
	)

}

export default Home
