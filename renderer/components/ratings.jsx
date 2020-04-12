import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BulletX } from '../styled/components'

const RatingsX = styled.div`

`

const RatingX = styled.div`
	@keyframes fadeInOut {
	  from {
	    opacity: 0;
	    transform: translate3d(0, 100%, 0);
	  }

	  // 50% {
	  //   transform: rotate(-10deg);
	  // }

	  to {
	    opacity: 1;
    	transform: translate3d(0, 0, 0);
	  }
	}

	animation-duration: 1s;
	animation-fill-mode: both;

	opacity: 0;
	${props => props.active && `
		animation-name: fadeInOut;
	`}
`

const Ratings = props => {

	const { current, data } = props

	return (
		<RatingsX>
			{data.length > 0 && data.map( ( rating, i ) => (
				<RatingX key={rating.name} active={current === i}>
					<h5>{rating.name} Rating</h5>
					{[ ...new Array( 10 ) ].map( ( _, j ) => <BulletX key={`${rating.name}${j.toString()}`} active={Math.round( rating.score ) > j}/> )}
					<p>{rating.score} / 10</p>
				</RatingX>
			) )}
		</RatingsX>
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
