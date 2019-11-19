import React, {useEffect} from 'react';
import {ipcRenderer} from 'electron';

const Worker = () => {
	// Send logs as messages to the main thread to show on the console
	const log = (value) => {
		if (ipcRenderer) {
			ipcRenderer.send('to-main', process.pid + ': ' + value);
		}
	}

	useEffect(() => {
		if (ipcRenderer) {
			// if message is received, pass it back to the renderer via the main thread
			ipcRenderer.on('to-worker', (event, arg) => {
				log('received ' + arg)
				ipcRenderer.send('for-renderer', process.pid + ' replying to: ' + arg)
			});

			// let the main thread know this thread is ready to process something
			ipcRenderer.send('ready')

			// demo - remove
			ipcRenderer.send('for-renderer', 'Hello from the worker!')

			log('Hello, worker')
		}

		return () => {
			// componentWillUnmount()
			if (ipcRenderer) {
				// unregister it
				ipcRenderer.removeAllListeners('to-worker');
			}
		};
	}, []); // Passing an empty array prevents effect on componentDidUpdate()

	return (
		<React.Fragment></React.Fragment>
	);
};

export default Worker;
