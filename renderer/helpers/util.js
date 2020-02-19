import  config from '../config'
import ipc from './safe-ipc'


export const broadcast = str => {
	console.log(str)
	log(str)
}

// Current time in ms
export const epoch = () => {
	const d = new Date()
	return d.getTime()
}

// Insecure string hashing function for UUIDs
// credit: https://github.com/darkskyapp/string-hash
export const hash = (str) => {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
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
	ipc.send('to-main', {
		command: 'log',
		data: `${process.pid}: ${value}`
	});
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
