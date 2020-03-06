export default {
	log: {
		firstRun: 'Starting Cinematic...',
		fetchGenreCache: 'Fetching genre list.',
		reset: 'Resetting server...'
	},
	warn: {
		cacheInvalid: 'No valid cache found. Starting fresh.',
		cacheValid: 'Loading from cache...',
		file: 'File not valid:',
		filecache: 'Loading cached movie',
	},
	error: {
		scanDir: 'Error scanning directory',
		scanPath: 'Error: Path is not a directory.',

		genres: 'Error fetching genre metadata',
		omdb: 'Error fetching OMDB data',
		tmdb: 'Error fetching TMDB data',
		trailer: 'Error fetching movie trailer data'

	},

	// Main process
	background: {
		dev: 'Development mode'
	},

	// Helpers
	q: {
		start: 'Starting queue',
		finish: 'API queue completed',
		error: 'Queue error',
		timeout: 'Queue job timeout'
	},

	ipc: {
		invalid: 'Invalid worker ipc message received'
	},

	// Component-specific
	directory: {
		init: '',
		placeholder: 'Directory of movie files...'
	},
	messagebox: {
		init: 'Loading...'
	}

}
