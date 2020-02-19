import electron, {ipcRenderer} from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import styled from 'styled-components'

import config from '../config'
import ipc from '../helpers/safe-ipc'
import Directory from '../components/directory'
import Messagebox from '../components/directory'

// Styles and Elements
const _Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: stretch;
`

const _Header = styled.div`
	flex: 1 1 100px;
	display: flex;
	flex-direction: row;
	width: 100%;
	background: gray;
`

const _Main = styled.div`
	flex: 1 1 100%;
	display: flex;
	flex-direction: row;
`

const _Sidebar = styled.div`
	flex: 0 0 20%;
	background: yellow;
`

const _Badge = styled.span`
	color: red;
`

const _Display = styled.div`
	flex: 1 1 100%;
	background: green;
`

const _Details = styled.div`
	flex: 1 0 200px;
	background: orange;
`

const Home = () => {

	// TODO - set initial state from electron store vals

	// State defaults
  const [message, setMessage] = useState('Loading...');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [state, setState] = useState(config.DEFAULT_STATE);

  // State properties
  const {dirpath, loading} = state

  const syncState = () => {
  	ipc.send('for-worker')
  }

  // Merge state
  const assignState = (newState) => {
  	setState(prevState => {
  		console.log({...prevState, ...newState})
  		return {...prevState, ...newState}
  	})
  }

  const movieList = () => {
  	// const {movies} = props
  	return movies.map((movie, i) => {
  		return (<p>{movie}</p>)
  	})
  }

  // Setup and tear-down communication
  useEffect(() => {
  	// Depends on [], so never re-run
    // componentDidMount()
      // register ipc events
      ipc.on('to-renderer', (event, arg) => {
				if (typeof arg === 'object') {
					const {command, data} = arg;
					switch (command) {
						case 'message':
							setMessage(data)
							break;
						case 'genres':
							setGenres(data)
							break;
						case 'movies':
							setMovies(data)
							break;
						case 'state':
							assignState(data)
							break;
						default:
							console.log('Invalid ipc message received')
							break;
					}
				} else {
					setMessage(arg)
				}
			});

    return () => {
      // componentWillUnmount()
        // unregister it
        ipc.removeAllListeners('to-renderer');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Home - Nextron (ipc-communication)</title>
      </Head>

      <_Container>

      	<_Header>
					<h1>Cinematic</h1>
					<Directory data={dirpath} handleChange={ e => assignState({dirpath: e.target.value}) } />

				</_Header>

				<_Main>

					<_Sidebar>
						<Link href="/next">
						  <a>Go to next page</a>
						</Link>
						{genres.map((genre, i) => {
							if (genre.items.length) {
								return <p key={genre._id}>{genre.name} <_Badge>{genre.items.length}</_Badge></p>
							}
						})}
					</_Sidebar>

					<_Display>
						<img src="/static/logo.png" />
						Loading: {loading}<br />
						{`COUNT: ${movies.length}`}
						{movies.map((movie, i) => {
							return <p key={movie._id}>{movie.title}</p>
						})}
					</_Display>

					<_Details>

					</_Details>
				</_Main>
				{/*<Refresh />*/}
      </_Container>

      <style jsx global>{`

      	* {
      		box-sizing: border-box;
      	}

      	html, body {
      		height: 100%;
      		margin: 0;
      	}

      	#__next {
      		height: 100%;
      	}

      `}</style>
    </>
  );
};

export default Home;
