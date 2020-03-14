import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrapperX = styled.div`
	display: flex;
	align-items: center;

	input {
	  display:none;
	}

	em {
		margin-left: 10px;
		font-size: 1rem;
	}

	label {
		display: inline-block;
		height: 34px;
		position: relative;
		width: 60px;
	}
`

const ToggleX = styled.div`
	background-color: #ccc;
	bottom: 0;
	cursor: pointer;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	transition: .4s;
	border-radius: 34px;

	&:before {
	  background-color: #fff;
	  bottom: 4px;
	  content: "";
	  height: 26px;
	  left: 4px;
	  position: absolute;
	  transition: .4s;
	  width: 26px;

	  border-radius: 50%;
	}

	// Active
	${props => props.active && `
		background-color: #66bb6a;

		&:before {
			transform: translateX(26px);
		}
	`}

`

const ThemeToggle = props => {

	const { isActive, handleChange } = props

	return (
		<WrapperX>
			<label>
				<input type="checkbox" onClick={handleChange}/>
				<ToggleX active={isActive}/>
			</label>
		</WrapperX>
	)

}

ThemeToggle.propTypes = {
	isActive: PropTypes.bool,
	handleChange: PropTypes.func
}

ThemeToggle.defaultProps = {
	isActive: false
}

export default ThemeToggle
