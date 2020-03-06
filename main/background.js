import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import logger from 'electron-timber'
import { createWindow } from './helpers'

// We want await, so we wrap in an async
( async () => {

	const isProd = process.env.NODE_ENV === 'production'

	if ( isProd ) {

		serve( { directory: 'app' } )

	} else {

		logger.log( 'Development mode' )
		app.setPath( 'userData', `${app.getPath( 'userData' )} (development)` )

	}

	await app.whenReady()

	const workerWindow = createWindow( 'worker', {
		// Show: false,  // <--- Comment me out to debug the worker window
		webPreferences: { nodeIntegration: true }
	} )

	const mainWindow = createWindow( 'main', {
		width: 1000,
		height: 600
		// EnableLargerThanScreen: true, // Enable the window to be resized larger than screen. Only relevant for macOS.
		// frame: false,
		// transparent: true,
		// titleBarStyle: 'hidden'

	} )

	// Main thread can receive directly from windows
	ipcMain.on( 'to-main', ( event, arg ) => {

		const { command, data } = arg
		if ( command ) {

			switch ( command ) {

				case 'online':
					logger.log( `Online: ${data}` )
					break
				case 'log':
					logger.log( `Log - ${data}` )
					break
				default:
					logger.log( `Command ${command}: ${data}` )

			}

		} else {

			// Argument is not a command
			logger.log( `Invalid message: ${arg}` )

		}

	} )

	// Windows can talk to each other via main
	ipcMain.on( 'for-renderer', ( event, arg ) => {

		mainWindow.webContents.send( 'to-renderer', arg )

	} )

	ipcMain.on( 'for-worker', ( event, arg ) => {

		workerWindow.webContents.send( 'to-worker', arg )

	} )

	// IpcMain.on( 'ready', ( event, arg ) => {
	// 	// ... Do something
	// } )

	mainWindow.on( 'closed', () => {

		// Call quit to exit, otherwise the background windows will keep the app running
		app.quit()

	} )

	app.on( 'window-all-closed', () => {

		app.quit()

	} )

	if ( isProd ) {

		await mainWindow.loadURL( 'app://./home.html' )
		await workerWindow.loadURL( 'app://./worker.html' )

	} else {

		const port = process.argv[2]
		await mainWindow.loadURL( `http://localhost:${port}/home` )
		await workerWindow.loadURL( `http://localhost:${port}/worker` )
		mainWindow.webContents.openDevTools()
		workerWindow.webContents.openDevTools()

	}

} )()

// Load
// Check cache
// -> Load movies from cache

// get previous state
// If no dir, get OS media dir
// Scan dir for existence
// search dir
// create movies
// check network
// get data
// cache
