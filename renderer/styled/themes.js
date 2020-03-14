import { darken, lighten, invert } from 'polished'
import { objectMap } from '../helpers/util'

const colors = {
	blacker: '#000',
	black: '#222',
	white: '#fff',

	blue: '#01a6f6',
	yellow: '#dba139'
}

/* Light mode */
const lightTheme = {
	sidebarColor: colors.black,
	sidebarBgColor: colors.white,

	displayColor: '#999',
	displayBgColor: '#ccc',

	highlightColor: colors.blue,
	highlightSecondaryColor: darken( 0.15, colors.blue ),

	buttonColor: colors.black,
	buttonBgColor: colors.white,
	buttonActiveColor: colors.white,
	buttonActiveBgColor: colors.blue,

	buttonHoverColor: '#55F',
	buttonHoverBgColor: '#FF0',

	buttonFocusColor: '#F50',
	buttonFocusBgColor: '#0FF',

	searchColor: 'rgba(246, 247, 249, 0.5)'
}

/* Dark mode */
const darkTheme = {
	searchColor: colors.yellow
}

// Merge any non-existant colors
const dark = { ...objectMap( lightTheme, value => invert( value ) ), ...darkTheme }

const light = { ...objectMap( darkTheme, value => invert( value ) ), ...lightTheme }

export { dark, light, colors }
