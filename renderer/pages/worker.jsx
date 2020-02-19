import React, {useEffect, useState} from 'react';
import {ipcRenderer} from 'electron';
import ipc from '../helpers/safe-ipc'
import {
	log,
	updateOnlineStatus
} from '../helpers/util.js'



const Worker = () => {

	// Kick off everything
	const startup = () => {
			log('Worker ready')
		  	updateOnlineStatus()

			// let the main thread know this thread is ready to process something
			ipcRenderer.send('ready')

			const init = require('../helpers/init')

			init.start()
	}

	useEffect(() => {
		// componentDidMount()
		// Test for network connection
		window.addEventListener('online',  updateOnlineStatus)
		window.addEventListener('offline',  updateOnlineStatus)

		// if message is received, pass it back to the renderer via the main thread
		ipc.on('to-worker', (event, arg) => {
			log('received ' + arg)
			ipc.send('for-renderer', {command: 'message', data: process.pid + ' replying to: ' + arg})
		});

		startup();

		// componentWillUnmount()
		return () => {
			// Unregister everything
			ipc.removeAllListeners('to-worker');

			window.removeEventListener('online')
			window.removeEventListener('offline')
		};
	}, []); // Passing an empty array prevents effect on componentDidUpdate()

	return (
		<React.Fragment></React.Fragment>
	);
};

export default Worker;
