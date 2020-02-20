import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import styled from 'styled-components'

import config from '../config'
import strings from '../helpers/strings'
import ipc from '../helpers/safe-ipc'
import Directory from '../components/directory'
import Messagebox from '../components/messagebox'

// TODO addRecent, addWatched, randomizeMovies, reset, open

// Styles and Elements
const ContainerX = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: stretch;
`

const HeaderX = styled.div`
	flex: 1 1 100px;
	display: flex;
	flex-direction: row;
	width: 100%;
	background: gray;
`

const MainX = styled.div`
	flex: 1 1 100%;
	display: flex;
	flex-direction: row;
`

const SidebarX = styled.div`
	flex: 0 0 20%;
	background: yellow;
`

const BadgeX = styled.span`
	color: red;
`

const DisplayX = styled.div`
	flex: 1 1 100%;
	background: green;
`

const DetailsX = styled.div`
	flex: 1 0 200px;
	background: orange;
`

const Home = () => {

	// TODO - set initial state from electron store vals

	// State defaults
	const [ message, setMessage ] = useState( strings.messagebox.init )
	const [ movies, setMovies ] = useState( [] )
	const [ genres, setGenres ] = useState( [] )
	const [ state, setState ] = useState( config.DEFAULT_STATE )

	// State properties
	const { dirpath, loading } = state

	// Send values back for store (dirpath mainly)
	const syncState = s => {

		s = s || state
		ipc.send( 'for-worker', { command: 'sync', data: s } )

	}

	// Merge state
	const assignState = newState => {

		setState( prevState => {

			return { ...prevState, ...newState }

		} )

	}

	const movieList = () => {

		// Const {movies} = props
		return movies.map( movie => {

			return <p key={movie._id}>{movie}</p>

		} )

	}

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
						console.log( 'Invalid ipc message received' )
						break

				}

			} else {

				setMessage( arg )

			}

		} )

		return () => {

			// ComponentWillUnmount()
			// unregister it
			ipc.removeAllListeners( 'to-renderer' )

		}

	}, [] )

	return (
		<>
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
						{movieList}
					</DisplayX>

					<DetailsX/>
				</MainX>
				{/* <Refresh /> */}
			</ContainerX>

			<style jsx global>
				{`
					* {
						box-sizing: border-box;
					}

					html,
					body {
						height: 100%;
						margin: 0;
					}

					#__next {
						height: 100%;
					}
				`}
			</style>
		</>
	)

}

export default Home
