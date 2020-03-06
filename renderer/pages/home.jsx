import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { ThemeProvider } from 'styled-components'

import config from '../config'

import { GlobalStyle } from '../styled/global'
import { dark, light } from '../styled/themes'
import { ContainerX, HeaderX, MainX, SidebarX, BadgeX, DisplayX, DetailsX } from '../styled/home'

import strings from '../helpers/strings'
import ipc from '../helpers/safe-ipc'
import { syncState } from '../helpers/util'

import Details from '../components/details'
import Directory from '../components/directory'
import Messagebox from '../components/messagebox'
import MovieList from '../components/movielist'

// TODO addRecent, addWatched, randomizeMovies, reset, open

const Home = () => {

	// TODO - set initial state from electron store vals

	// State defaults
	const [ message, setMessage ] = useState( strings.messagebox.init )
	const [ movies, setMovies ] = useState( [] )
	const [ genres, setGenres ] = useState( [] )
	const [ state, setState ] = useState( config.DEFAULT_STATE )

	const [ currentMovie, setCurrent ] = useState( {} )

	// State properties
	const { dirpath, loading } = state

	// Merge state
	const assignState = newState => {

		setState( prevState => {

			return { ...prevState, ...newState }

		} )

	}

	/* Handlers */
	const onChangeCurrentMovie = index => setCurrent( movies[index] )

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
						console.log( `Invalid ipc message received: ${arg}` )
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
					<h1>Cinematic</h1>
					<Directory
						data={dirpath}
						handleChange={e => {

							assignState( { dirpath: e.target.value } )
							syncState( state )

						}}
					/>

					<Messagebox data={message}/>
				</HeaderX>

				<MainX>
					<SidebarX>
						<Link href="/next">
							<a>Go to next page</a>
						</Link>
						{genres && genres.map( genre => {

							if ( genre.items.length > 0 ) {

								return (
									<p key={genre._id}>
										{genre.name} <BadgeX>{genre.items.length}</BadgeX>
									</p>
								)

							}

							return false

						} )}
					</SidebarX>

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
			</ContainerX>
		</ThemeProvider>
	)

}

export default Home
