import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

// We want await, so we wrap in an async
(async () => {
	const isProd = process.env.NODE_ENV === 'production';

	if (isProd) {
		serve({ directory: 'app' });
	} else {
		app.setPath('userData', `${app.getPath('userData')} (development)`);
	}

  await app.whenReady();

	const workerWindow = createWindow('worker', {
		show: false,  // <--- Comment me out to debug the worker window
		webPreferences: { nodeIntegration: true }
	});

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

	// Main thread can receive directly from windows
	ipcMain.on('to-main', (event, arg) => {
	 console.log(arg)
	});

	// Windows can talk to each other via main
	ipcMain.on('for-renderer', (event, arg) => {
	 mainWindow.webContents.send('to-renderer', arg);
	});

	ipcMain.on('for-worker', (event, arg) => {
	 workerWindow.webContents.send('to-worker', arg);
	});

	ipcMain.on('ready', (event, arg) => {

	})

	mainWindow.on('closed', () => {
			// call quit to exit, otherwise the background windows will keep the app running
		app.quit()
	})

	app.on('window-all-closed', () => {
		app.quit();
	});

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
    await workerWindow.loadURL('app://./worker.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    await workerWindow.loadURL(`http://localhost:${port}/worker`);
    mainWindow.webContents.openDevTools();
  }
})();
