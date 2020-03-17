import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 200px);
	grid-gap: 1rem;

	// Negative item padding-top
	margin-top: -1rem;

	padding: 0 1rem;
`

const MovieX = styled.div`
	transition-timing-function: ease-out;
	transition-property: color, background-color;

	height: 100%
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	border-radius: 6px;
	padding: 1rem .5rem;


	${props => props.active && `
		background-color: ${props.theme.movieItemBgColor};
	`}
`

const PosterX = styled.div`
	img {
		width: 100%;
	}
`

const MovieInfoX = styled.div``

const MovieList = props => {

	const { current, data, handleChange } = props

	return (
		<WrapperX>
			{data.map( movie => {

				return (
					<MovieX key={movie._id} active={current === movie._id} onClick={() => handleChange( movie._id )}>
						<PosterX>
							<img src={movie.poster} alt={`Poster for ${movie.title}`}/>
						</PosterX>
						<MovieInfoX>
							<h3>{movie.title}</h3>
							<h4>{movie.genre}</h4>
						</MovieInfoX>
					</MovieX>
				)

			} )}
		</WrapperX>
	)

}

MovieList.propTypes = {
	current: PropTypes.number,
	data: PropTypes.array,
	handleChange: PropTypes.func
}

MovieList.defaultProps = {
	data: []
}

export default MovieList
