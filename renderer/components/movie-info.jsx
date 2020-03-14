import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'
import ipc from '../helpers/safe-ipc'
import Button from './button'

const WrapperX = styled.div`
	height: 100vh;
	overflow-y: auto;
	padding-bottom: 380px;


	flex-grow: 0;
	flex-shrink: 0;
	flex-basis: 500px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	background: orange;
	position: relative;
	transition: flex-basis 3s ease;
`

const BackdropX = styled.div`
	width: 100%;
`

const BackdropImgX = styled.img`
	width: 100%;
`

const BackdropMirrorX = styled( BackdropImgX )`
	transform: scaleY(-1);
	filter: FlipV;
`

const TitleX = styled.h2``

const InfoX = styled.div``

const RatingsX = styled.div``

const CopyX = styled.p``

const PlotX = styled.p``

const TrailerX = styled.div`
	position: fixed;
	z-index: 2;
	bottom: 0;
	width: 500px;
	height: 280px;

	iframe {
		margin-bottom: -4px;
	}
`

const BulletsX = styled.div`
	position: absolute;
	// cursor: pointer;
	z-index: 3;
	top: 0;
	left: 0;
	padding: 1em;
	opacity: 0.4;
	transition: opacity .2s ease-in;

	&:hover {
		opacity: 0.9;
	}
`
const BulletX = styled( Button )`
	display: inline-block;
	float: left;
	margin: 4px 8px 4px 0;
	border-radius: 50%;
	width: 14px;
	height: 14px;
	background: blue;
	background-position: center center;
	box-shadow: 1px 1px 5px #BBB;

	${props => props.active && `
		background-color: #FFF;
	`}
`

const MovieList = props => {

	const { data } = props

	const [ currentRating, setCurrentRating ] = useState( 0 )
	const [ currentTrailer, setCurrentTrailer ] = useState( 0 )

	/* Trigger 'open' file command */
	const openFile = filepath => ipc.send( 'to-main', { command: 'open', data: filepath } )

	return (
		<WrapperX>
			{data.title && (
				<>
					<BackdropX>
						<BackdropImgX src={data.backdrop} alt={`Backdrop for ${data.title}`}/>
						<BackdropMirrorX src={data.backdrop} alt=""/>
					</BackdropX>

					<TitleX>{data.title} {data.year && `(${data.year})`}</TitleX>

					<Button handleChange={() => openFile( data.filepath )}>Watch</Button>

					<InfoX>
						{data.genres && <CopyX>{data.genres}</CopyX>}
						{data.runtime && (
							<CopyX>
								{data.runtime} minutes
								{data.imdbId && (
									<span> | <a id="imdb-link" rel="noopener noreferrer" target="_blank" href={`http://www.imdb.com/title/${data.imdbId}`}>{strings.movie.imdbLink}</a></span>
								)}
							</CopyX>
						)}
					</InfoX>

					<RatingsX/>

					<PlotX>{data.plot}</PlotX>

					{data.Director && <CopyX>{strings.movie.director}: {data.Director}</CopyX> }
					{data.Writer && <CopyX>{strings.movie.writer}: {data.Writer}</CopyX> }
					{data.Actors && <CopyX>{strings.movie.actor}: {data.Actors}</CopyX> }
					{data.Awards && <CopyX>{strings.movie.award}: {data.Awards}</CopyX> }
					{data.trailers && <CopyX>{strings.movie.trailer}:</CopyX> }

					{data.trailers && (
						<TrailerX>
							{data.trailers.length > 1 && (
								<BulletsX>
									{data.trailers.map( ( trailer, i ) => {

										return <BulletX key={trailer} active={currentTrailer === i} data="" handleChange={() => setCurrentTrailer( i )}/>

									} )}
								</BulletsX>
							)}
							<iframe allowFullScreen width="500" height="281" frameBorder="0" src={`https://www.youtube-nocookie.com/embed/${data.trailers[currentTrailer]}?rel=0&showinfo=0`}/>
						</TrailerX>
					)}
				</>
			)}
		</WrapperX>
	)

}

MovieList.propTypes = {
	data: PropTypes.object
}

MovieList.defaultProps = {
	data: {}
}

export default MovieList
