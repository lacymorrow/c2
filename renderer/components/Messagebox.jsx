import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

// TODO styles
const WrapperX = styled.div`
	background-color: teal;
`
const Messagebox = props => {

	const { data } = props

	return (
		<WrapperX>
			<p>{data}</p>
		</WrapperX>
	)

}

Messagebox.propTypes = {
	data: PropTypes.string
}

Messagebox.defaultProps = {
	data: strings.messagebox.init
}

export default Messagebox
