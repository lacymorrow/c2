import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { rgba } from 'polished'
import { FiExternalLink, FiTv } from 'react-icons/fi'

import strings from '../helpers/strings'
import { openFile, openUrl } from '../helpers/safe-ipc'
import Button from './button'

const WrapperX = styled.div`
	height: 100vh;
	flex-grow: 0;
	flex-shrink: 0;
	flex-basis: 500px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	position: relative;
	transition: flex-basis 3s ease;
`

const BackdropX = styled.div`
	width: 100%;
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: -1;

`

const BackdropImgX = styled.img`
	width: 100%;
`

const BackdropMirrorX = styled( BackdropImgX )`
	margin-top: -3px;
	filter: FlipV;
	transform: scaleY(-1);
`

const ImdbLinkX = styled( Button )`

`

const InfoWrapperX = styled.div`
	// Scroll container
	height: 100%;
	overflow-y: auto;
`

const InfoX = styled.div`
	transition-timing-function: ease-out;
	transition-property: color, background;
	color: ${props => props.theme.infoColor};
	background: linear-gradient(to bottom, ${props => rgba(props.theme.infoBgColor, .8)}, ${props => rgba(props.theme.infoBgColor, 1)}, ${props => rgba(props.theme.infoBgColor, 1)});
	margin-top: 280px;
	padding: 1rem 1rem 380px;
`

const TitleX = styled.h2`
	margin-top: 0;
`

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
	padding: 1rem;
	opacity: 0.4;
	transition: opacity .2s ease-in;

	&:hover {
		opacity: 0.9;
	}
`

// TODO bullet styles
const BulletX = styled( Button )`
	display: inline-block;
	margin: 4px 8px 4px 0;
	border-radius: 50%;
	width: 1em;
	height: 1em;
	background-color: blue;
	box-shadow: 1px 1px 5px #BBB;

	transition-property: background-color;
	${props => props.active && `
		background-color: ${props.theme.buttonActiveColor};
	`}
`

const MovieInfo = props => {

	const { data } = props

	const [ currentRating, setCurrentRating ] = useState( 0 )
	const [ currentTrailer, setCurrentTrailer ] = useState( 0 )

	useEffect( () => {

		let timer

		if ( data.ratings ) {

			timer = setInterval( () => {

				setCurrentRating( ( currentRating + 1 ) % data.ratings.length )

			}, 3000 )

			return () => clearInterval( timer )

		}

	}, [ data, currentRating ] )

	return (
		<WrapperX>
			{data.title && (
				<>
					<BackdropX>
						<BackdropImgX src={data.backdrop} alt={`Backdrop for ${data.title}`}/>
						<BackdropMirrorX src={data.backdrop} alt=""/>
					</BackdropX>

					<InfoWrapperX>
						<InfoX>
							<TitleX>{data.title} {data.year && `(${data.year})`}</TitleX>

							<Button handleChange={() => openFile( data.filepath )}>Watch <FiTv size={24} /></Button>

							{data.Genre && <CopyX>{data.Genre}</CopyX>}
							{data.runtime && (
								<CopyX>
									{data.runtime} minutes
									{data.imdbId && (
										<span> | <ImdbLinkX handleChange={() => openUrl( `http://www.imdb.com/title/${data.imdbId}` )}>{strings.movie.imdbLink} <FiExternalLink size={24}/></ImdbLinkX></span>
									)}
								</CopyX>
							)}

							<RatingsX/>

							<PlotX>{data.plot}</PlotX>
							<PlotX>{data.overview}</PlotX>

							{data.BoxOffice && <CopyX><b>BoxOffice:</b> {data.BoxOffice}</CopyX> }
							{data.DVD && <CopyX><b>DVD release date:</b> {data.DVD}</CopyX> }
							{data.Country && <CopyX><b>Country:</b> {data.Country}</CopyX> }
							{data.Language && <CopyX><b>Language:</b> {data.Language}</CopyX> }
							{data.Rated && <CopyX><b>Rated:</b> {data.Rated}</CopyX> }
							{data.Production && <CopyX><b>Studio:</b> {data.Production}</CopyX> }

							{data.Director && <CopyX><b>{strings.movie.director}:</b> {data.Director}</CopyX> }
							{data.Writer && <CopyX><b>{strings.movie.writer}:</b> {data.Writer}</CopyX> }
							{data.Actors && <CopyX><b>{strings.movie.actor}:</b> {data.Actors}</CopyX> }
							{data.Awards && <CopyX><b>{strings.movie.award}:</b> {data.Awards}</CopyX> }
							{data.trailers && <CopyX><b>{strings.movie.trailer}:</b></CopyX> }
						</InfoX>
					</InfoWrapperX>

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

MovieInfo.propTypes = {
	data: PropTypes.object
}

MovieInfo.defaultProps = {
	data: {}
}

export default MovieInfo
