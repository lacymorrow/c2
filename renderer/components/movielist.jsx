import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div`
	background: blue;
`

const MovieList = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			{data.map( ( movie, i ) => {

				return <p key={movie._id} data-id={i} onClick={e => handleChange( e.target.dataset.id )}>{movie.title}</p>

			} )}
		</WrapperX>
	)

}

MovieList.propTypes = {
	data: PropTypes.array,
	handleChange: PropTypes.func
}

MovieList.defaultProps = {
	data: []
}

export default MovieList
