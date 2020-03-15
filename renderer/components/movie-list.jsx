import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 200px);
	grid-gap: 2rem;


	transition: color .6s ease-out, background-color .6s ease-out;
	color: ${props => props.theme.displayColor};
	background-color: ${props => props.theme.displayBgColor};
`

const MovieX = styled.div`
	transition: color .6s ease-out, background-color .6s ease-out;
	${props => props.active && `
		background-color: ${props.theme.highlightColor};

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
	current: PropTypes.string,
	data: PropTypes.array,
	handleChange: PropTypes.func
}

MovieList.defaultProps = {
	data: []
}

export default MovieList
