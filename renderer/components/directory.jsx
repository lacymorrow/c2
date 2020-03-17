import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FiSearch } from 'react-icons/fi'
// Import { IoIosSearch } from 'react-icons/io'

import strings from '../helpers/strings'

const WrapperX = styled.div`
	transition-property: color, background-color;
	color: ${props => props.theme.headerColor};
	background-color: ${props => props.theme.headerBgColor};

	position: relative;
`

const IconX = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: .5rem;

	display: flex;
	align-items: center;
	flex-direction: row;
`

const DirectoryInputX = styled.input`
	color: ${props => props.theme.headerColor};
	background-color: ${props => props.theme.headerBgColor};
	padding: .5rem .5rem .5rem 2.5rem;
`

const Directory = props => {

	const { data, handleChange } = props

	// TODO Glyphicons
	return (
		<WrapperX>
			<IconX><FiSearch size={24}/></IconX>
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
