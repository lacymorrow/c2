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

	transition-timing-function: ease-out;
	transition-property: color, background-color, outline, transform;

    color: ${props => props.theme.buttonColor};
    background-color: ${props => props.theme.buttonBgColor};

    /* inherit font & color from ancestor */
    font: inherit;

    /* Normalize 'line-height'. Cannot be changed from 'normal' in Firefox 4+. */
    line-height: normal;

	/* A11y styles */
	&:hover{
	    color: ${props => props.theme.buttonHoverColor};
	    background-color: ${props => props.theme.buttonHoverBgColor};
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
