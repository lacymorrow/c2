import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

const ButtonX = styled.button`
	/* Button reset: https://gist.github.com/MoOx/9137295 */
	border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    /* inherit font & color from ancestor */
    color: inherit;
    font: inherit;

    /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
    line-height: normal;

    /* Corrects font smoothing for webkit */
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    /* Corrects inability to style clickable 'input' types in iOS */
    -webkit-appearance: none;

	/* Remove excess padding and border in Firefox 4+ */
	&::-moz-focus-inner {
	    border: 0;
	    padding: 0;
	}

	/* A11y styles */
	&:hover,
	&:focus {
	    background: #0053ba;
	}

	&:focus {
	    outline: 1px solid #fff;
	    outline-offset: -4px;
	}

	&:active {
	    transform: scale(0.99);
	}
`

const Button = props => {

	const { children, data, handleChange } = props

	return (
		<ButtonX {...props} onClick={handleChange}>{data || children}</ButtonX>
	)

}

Button.propTypes = {
	children: PropTypes.array,
	data: PropTypes.string,
	handleChange: PropTypes.func
}

Button.defaultProps = {
	data: strings.button.init
}

export default Button
