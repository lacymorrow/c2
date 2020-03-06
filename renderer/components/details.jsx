import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div``

const Details = props => {

	const { data } = props

	return (
		<WrapperX>
			{JSON.stringify( data )}
		</WrapperX>
	)

}

Details.propTypes = {
	data: PropTypes.object
}

Details.defaultProps = {
	data: {}
}

export default Details
