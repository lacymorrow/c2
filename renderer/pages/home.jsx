import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import { ThemeProvider } from 'styled-components'

import config from '../config'

import { GlobalStyle } from '../styled/global'
import { dark, light } from '../styled/themes'
import { ContainerX, HeaderX, MainX, DisplayX } from '../styled/home'

import ipc from '../helpers/safe-ipc'
import strings from '../helpers/strings'
import { pageVsGenreId, syncState } from '../helpers/util'

import Directory from '../components/directory'
import Messagebox from '../components/messagebox'
import MovieInfo from '../components/movie-info'
import MovieList from '../components/movie-list'
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
	const [ state, setState ] = useState( config.DEFAULT_STATE )

	const [ currentMovie, setCurrentMovie ] = useState( {} )
	const [ currentPage, setCurrentPage ] = useState( config.DEFAULT_STATE.currentPage )
	const [ currentTheme, setCurrentTheme ] = useState( light )

	// State properties
	const { dirpath, loading } = state

	// Merge state
	const assignState = newState => {

		setState( prevState => {

			return { ...prevState, ...newState }

		} )

	}

	/* HANDLERS */
	const onChangeDirectory = dirpath => {

		// Todo
		// Set new directory
		assignState( { dirpath } )

	}

	const onChangePage = page => {

		if ( pageVsGenreId( page ) ) {

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

	const onChangeCurrentMovie = index => setCurrentMovie( movies[index] )

	const onClickResetButton = () => {

		console.log( strings.resetBtn.click )
		syncState() // Send state back to worker

	}

	/* State Effect Functions */

	// On Page Change
	useEffect( () => {

	}, [ currentPage ] )

	// State change callback
	useEffect( () => {
		// If (state.dirpath !== state.currentDir) {
		// 	console.log('SYNC', state.dirpath, state.currentDir)
		// 	syncState( state ) // Send state back to worker
		// }

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
						setGenres( data )
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

	/* Template */

	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle/>
			<Head>
				<title>Home - Nextron (ipc-communication)</title>
			</Head>

			<ContainerX>
				<HeaderX>
					<Directory
						data={dirpath}
						handleChange={onChangeDirectory}
					/>

					<Messagebox data={message}/>

					<ThemeToggle isActive={currentTheme === light} handleChange={onChangeTheme}/>
				</HeaderX>

				<MainX>
					<Sidebar data={genres} handleChange={onChangePage} currentPage={currentPage} movieCount={movies.length}/>

					<DisplayX>
						{`COUNT: ${movies.length}`}						Loading: {loading}
						<br/>
						<MovieList data={movies} filter={!pageVsGenreId( currentPage ) && currentPage} handleChange={onChangeCurrentMovie}/>
					</DisplayX>

					<MovieInfo data={currentMovie}/>

				</MainX>
				{/* <Refresh /> */}
				<ResetButton handleChange={onClickResetButton}/>
			</ContainerX>
		</ThemeProvider>
	)

}

export default Home
