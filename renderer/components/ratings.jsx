import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import config from '../config'
import { BulletX } from '../styled/components'

const RatingsX = styled.div`
	position: relative;
	height: 150px;
`

const RatingX = styled.div`
	@keyframes fadeInOut {
	  from {
	    opacity: 0;
	    transform: translate3d(0, 50%, 0);
	  }

  	  10% {
  	    opacity: 1;
      	transform: translate3d(0, 0, 0);
  	  }


	  90% {
	    opacity: 1;
    	transform: translate3d(0, 0, 0);
	  }

	  to {
	  	opacity: 0;
	  	transform: translate3d(0, -50%, 0);
	  }
	}

	animation-duration: ${parseInt(config.RATING_DELAY/1000)}s;
	animation-fill-mode: both;

	opacity: 0;
	position: absolute;
	${props => props.active && `
		animation-name: fadeInOut;
	`}
`

const Ratings = props => {

	const { current, data } = props

	return (
		<>
			{data.length > 0 && (
				<RatingsX>
					{data.map( ( rating, i ) => (
						<RatingX key={rating.name} active={current === i} total={data.length} index={i}>
							<h5>{rating.name} Rating</h5>
							{[ ...new Array( 10 ) ].map( ( _, j ) => <BulletX key={`${rating.name}${j.toString()}`} active={Math.round( rating.score ) > j}/> )}
							<p>{rating.score} / 10</p>
						</RatingX>
					) )}
				</RatingsX>
			) }
		</>
	)

}

Ratings.propTypes = {
	current: PropTypes.number,
	data: PropTypes.array
}

Ratings.defaultProps = {
	current: 0,
	data: []
}

export default Ratings
