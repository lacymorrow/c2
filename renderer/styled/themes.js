import { darken, lighten, invert } from 'polished'

const colors = {
	yellow: '#dba139'
}

/* Light mode */
const light = {
	colorPrimary: '#222',
	colorSecondary: '#999',
	bgColorPrimary: '#fff',
	bgColorSecondary: '#ccc',
	searchColor: 'rgba(246, 247, 249, 0.5)'
}

/* Dark mode */
const dark = {
	colorPrimary: '#fff',
	colorSecondary: '#ccc',
	bgColorPrimary: '#444',
	bgColorSecondary: '#777',
	searchColor: colors.yellow
}

export { dark, light }
