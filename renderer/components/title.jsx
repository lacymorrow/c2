import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

const TitleX = styled.h1`
	color: ${props => props.theme.colorPrimary};
`

const Title = props => {

	const { data } = props

	return (
		<TitleX {...props}>
			{data}
		</TitleX>
	)

}

Title.propTypes = {
	data: PropTypes.string
}

Title.defaultProps = {
	data: strings.app.title
}

export default Title
