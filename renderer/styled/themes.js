import { darken, lighten, invert } from 'polished'

const colors = {
	black: '#222',
	white: '#fff',

	blue: '#01a6f6',
	yellow: '#dba139'
}

/* Light mode */
const lightTheme = {
	colorPrimary: colors.black,
	colorBgPrimary: colors.white,

	colorSecondary: '#999',
	colorBgSecondary: '#ccc',

	highlightColor: 'green',
	highlightBgColor: 'teal',

	buttonColor: 'black',
	buttonBgColor: 'transparent',
	buttonActiveColor: colors.white,
	buttonActiveBgColor: colors.blue,

	buttonHoverColor: 'cerulean',
	buttonHoverBgColor: 'orange',

	buttonFocusColor: 'orange',
	buttonFocusBgColor: 'purple',


	searchColor: 'rgba(246, 247, 249, 0.5)'
}

/* Dark mode */
const darkTheme = {
	colorPrimary: '#fff',
	colorBgPrimary: '#444',

	colorSecondary: '#ccc',
	colorBgSecondary: '#777',

	buttonColor: colors.blue,

	buttonFocusColor: '#fff',

	highlightColor: colors.blue,
	searchColor: colors.yellow
}

// Merge any non-existant colors
const dark = { ...lightTheme, ...darkTheme }

const light = { ...darkTheme, ...lightTheme }

export { dark, light, colors }
