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
		height: 100vh;
		margin: 0;
		overflow: hidden;

		font-size: 16px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
			sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
		text-rendering: optimizeLegibility;
		font-feature-settings: 'liga', 'clig', 'kern';
	}
`
