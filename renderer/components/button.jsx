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
    cursor: pointer;

    color: ${props => props.theme.buttonColor};
    background: ${props => props.theme.buttonBgColor};

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
	&:hover{
	    color: ${props => props.theme.buttonHoverColor};
	    background: ${props => props.theme.buttonHoverBgColor};
	}

	&:focus {
	    outline: 1px solid ${props => props.theme.buttonFocusColor};
	    outline-offset: -4px;
	}

	&:active {
	    transform: scale(0.99);
	}
`

const Button = props => {

	const { children, data, handleChange } = props

	return (
		<ButtonX {...props} onClick={handleChange}>{children || data}</ButtonX>
	)

}

Button.propTypes = {
	children: PropTypes.node,
	data: PropTypes.string,
	handleChange: PropTypes.func
}

Button.defaultProps = {
	data: strings.button.init
}

export default Button
