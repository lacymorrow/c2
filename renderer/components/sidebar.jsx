import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

const WrapperX = styled.div`
	background: transparent;
`

const Sidebar = props => {

	const { data, handleChange } = props

	return (
		<WrapperX/>
	)

}

Sidebar.propTypes = {
	data: PropTypes.string,
	handleChange: PropTypes.func
}

Sidebar.defaultProps = {
	data: strings.sidebar.browse
}

export default Sidebar
