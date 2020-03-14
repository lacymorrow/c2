import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

const WrapperX = styled.div``

const Directory = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			<span className="glyphicon glyphicon-search" aria-hidden="true"/>
			<input
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
