import { normalize } from 'polished'
import { createGlobalStyle } from 'styled-components'

// Styles and Elements
export const GlobalStyle = createGlobalStyle`
	${normalize()}
	* {
		box-sizing: border-box;
	}

	#__next {
		height: 100%;
	}

	html,
	body {
		height: 100%;
		margin: 0;
	}
`
