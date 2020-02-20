import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import ipc from '../helpers/safe-ipc'
import { log, updateOnlineStatus } from '../helpers/util'

const Worker = () => {

	// Kick off everything
	const startup = () => {

		log( 'Worker ready' )
		updateOnlineStatus()

		// Let the main thread know this thread is ready to process something
		ipcRenderer.send( 'ready' )

		const app = require( '../helpers/app' )

		app.start()

	}

	useEffect( () => {

		// ComponentDidMount()
		// Test for network connection
		window.addEventListener( 'online', updateOnlineStatus )
		window.addEventListener( 'offline', updateOnlineStatus )

		// If message is received, pass it back to the renderer via the main thread
		ipc.on( 'to-worker', ( event, arg ) => {

			log( 'received ' + arg )
			ipc.send( 'for-renderer', {
				command: 'message',
				data: process.pid + ' replying to: ' + arg
			} )

		} )

		startup()

		// ComponentWillUnmount()
		return () => {

			// Unregister everything
			ipc.removeAllListeners( 'to-worker' )

			window.removeEventListener( 'online' )
			window.removeEventListener( 'offline' )

		}

	}, [] ) // Passing an empty array prevents effect on componentDidUpdate()

	return ( <div/> )

}

export default Worker
