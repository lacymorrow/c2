import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'
import Button from './button'

const WrapperX = styled.div``

const ResetBtn = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			<Button {...handleChange} {...props}>
				{data}
				<span className="glyphicon glyphicon-search" aria-hidden="true"/>
			</Button>
		</WrapperX>
	)

}

ResetBtn.propTypes = {
	data: PropTypes.string,
	handleChange: PropTypes.func
}

ResetBtn.defaultProps = {
	data: strings.resetBtn.tooltip
}

export default ResetBtn
