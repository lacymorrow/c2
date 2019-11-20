import ipc from './safe-ipc'

export const broadcast = str => log

// Current time
export const epoch = () => {
	const d = new Date()
	return d.getTime() / 1000
}

// String matches ignore list
export const ignorePattern = str => {
	return config.IGNORE_PATTERN.includes(str.toLowerCase())
}

// Bool if a string is a digit
export const isDigit = (str) => {
	return !isNaN(parseFloat(str)) && isFinite(str)
}

// Send logs as messages to the main thread to show on the console
export const log = (value) => {
	ipc.send('to-main', `${process.pid}: ${value}`);
}

 // Replace underscores and hypens with spaces replaceUglyChars is a better name
export const prettyName = (name) => {
	name = replaceAll(name, '_', ' ')
	name = replaceAll(name, '-', ' ')
	return name
}

// Replace every instance of a string with another
const replaceAll = (str, find, replace) => {
	return str.replace(new RegExp(find, 'g'), replace)
}

// Network status
export const updateOnlineStatus = () => {
	ipc.send('to-main', {command: 'online', data: navigator.onLine})
}
