import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FiSearch } from 'react-icons/fi'
// Import { IoIosSearch } from 'react-icons/io'

import strings from '../helpers/strings'

const WrapperX = styled.div`
	transition-timing-function: ease-out;
	transition-property: background-color;
	background-color: ${props => props.theme.searchColor}

	position: relative;
`

const IconX = styled.div`
	display: inline-block;
`

const DirectoryInputX = styled.input`
	padding: .5em .5em .5em 1em;
`

const Directory = props => {

	const { data, handleChange } = props

	// TODO Glyphicons
	return (
		<WrapperX>
			<IconX><FiSearch/></IconX>
			<DirectoryInputX
				type="text"
				placeholder={strings.directory.placeholder}
				value={data}
				onChange={e => handleChange( e.currentTarget.value )}
			/>
		</WrapperX>
	)

}

Directory.propTypes = {
	data: PropTypes.string,
	handleChange: PropTypes.func
}

Directory.defaultProps = {
	data: strings.directory.init
}

export default Directory
