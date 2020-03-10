import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 200px);
	grid-gap: 2rem;

	color: ${props => props.theme.colorSecondary};
	background-color: ${props => props.theme.colorBgSecondary};


`

const PosterX = styled.div`

	img {
		width: 100%;
	}
`

const MovieInfoX = styled.div`

`

const MovieList = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			{data.map( ( movie, i ) => {

				return (
					<div key={movie._id} data-id={i} onClick={e => handleChange( e.currentTarget.dataset.id )}>
						<PosterX>
							<img src={movie.poster} alt={`Poster for ${movie.title}`} />
						</PosterX>
						<MovieInfoX>
							<h3>{movie.title}</h3>
							<h4>{movie.genre}</h4>
						</MovieInfoX>
					</div>
				)

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
