import React, {useRef} from 'react'
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


const Directory = props => {

	const { data, handleChange } = props

	const fileInput = useRef()

	// TODO Glyphicons
	return (
		<WrapperX>
			<input type="file" ref={fileInput} />
			<IconX><FiSearch size={24}/></IconX>
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
