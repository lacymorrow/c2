import {ipcRenderer} from 'electron';

export const on = (key, fn) => {
	if (ipcRenderer) {
		ipcRenderer.on(key, fn)
	}
}

export const removeAllListeners = (key) => {
	if (ipcRenderer) {
		ipcRenderer.removeAllListeners(key)
	}
}

export const send = (key, arg) => {
	if (ipcRenderer) {
		ipcRenderer.send(key, arg)
	}
}

export default {on, send}
