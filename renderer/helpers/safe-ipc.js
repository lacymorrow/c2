import { ipcRenderer } from 'electron'

const on = ( key, fn ) => {

	if ( ipcRenderer ) {

		ipcRenderer.on( key, fn )

	}

}

const removeAllListeners = key => {

	if ( ipcRenderer ) {

		ipcRenderer.removeAllListeners( key )

	}

}

const send = ( key, arg ) => {

	if ( ipcRenderer ) {

		ipcRenderer.send( key, arg )

	}

}

export default { on, send, removeAllListeners }
