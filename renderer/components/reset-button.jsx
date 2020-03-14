import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'
import Button from './button'

const WrapperX = styled.div``

const ResetButton = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			<Button {...handleChange} {...props}>
				{data}
			</Button>
		</WrapperX>
	)

}

ResetButton.propTypes = {
	data: PropTypes.string,
	handleChange: PropTypes.func
}

ResetButton.defaultProps = {
	data: strings.resetBtn.tooltip
}

export default ResetButton
