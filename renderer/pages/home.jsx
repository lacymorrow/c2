import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import { ThemeProvider } from 'styled-components'

import config from '../config'

import { GlobalStyle } from '../styled/global'
import { dark, light } from '../styled/themes'
import { ContainerX, HeaderX, MainX, DisplayX, DetailsX } from '../styled/home'

import strings from '../helpers/strings'
import ipc from '../helpers/safe-ipc'
import { syncState } from '../helpers/util'

import Details from '../components/details'
import Directory from '../components/directory'
import Messagebox from '../components/messagebox'
import MovieList from '../components/movielist'
import ResetBtn from '../components/reset-btn'
import Sidebar from '../components/sidebar'

// TODO addRecent, addWatched, randomizeMovies, reset, open

const Home = () => {

	// TODO - set initial state from electron store vals

	// State defaults
	const [ message, setMessage ] = useState( strings.messagebox.init )
	const [ movies, setMovies ] = useState( [] )
	const [ genres, setGenres ] = useState( [] )
	const [ state, setState ] = useState( config.DEFAULT_STATE )

	const [ currentGenre, setCurrentGenre ] = useState( {} ) // Todo
	const [ currentMovie, setCurrentMovie ] = useState( {} )

	// State properties
	const { dirpath, loading } = state

	// Merge state
	const assignState = newState => {

		setState( prevState => {

			return { ...prevState, ...newState }

		} )

	}

	/* Handlers */
	const onChangeDirectory = dirpath => {

		// Todo
		// Set new directory
		assignState( { dirpath } )

	}

	const onChangeCurrentGenre = index => {

		console.log( 'genre', index )
		setCurrentGenre( genres[index] )

	}

	const onChangeCurrentMovie = index => setCurrentMovie( movies[index] )

	const onResetButton = () => {
		console.log('RESET')
		syncState() // Send state back to worker
	}

	// State change callback
	useEffect( () => {
		if (state.dirpath !== state.currentDir) {
			console.log('SYNC', state.dirpath, state.currentDir)
			// syncState( state ) // Send state back to worker
		}

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

	return (
		<ThemeProvider theme={light}>
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
				</HeaderX>

				<MainX>
					<Sidebar data={genres} handleChange={onChangeCurrentGenre}/>

					<DisplayX>
						<img src="/static/logo.png"/>
						Loading: {loading}
						<br/>
						{`COUNT: ${movies.length}`}
						<MovieList data={movies} handleChange={onChangeCurrentMovie}/>
					</DisplayX>

					<DetailsX>
						<Details data={currentMovie}/>
					</DetailsX>
				</MainX>
				{/* <Refresh /> */}
				<ResetBtn handleChange={onResetButton} />
			</ContainerX>
		</ThemeProvider>
	)

}

export default Home
