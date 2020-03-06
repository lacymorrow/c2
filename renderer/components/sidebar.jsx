import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

import Button from './button'
import Title from './title'

const WrapperX = styled.div`
	flex: 0 0 20%;
	color: ${props => props.theme.colorPrimary};
	background: ${props => props.theme.bgColorPrimary};
`

const ListX = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`

const ItemX = styled.li`

`

const BadgeX = styled.span`
	color: red;
`

const Sidebar = props => {

	const { data, handleChange } = props

	return (
		<WrapperX>
			<Title />
			<ListX>
				{data && data.map( genre => {

					if ( genre.items.length > 0 ) {

						return (
							<ItemX key={genre._id}>
								<Button data-id={genre._id} handleChange={e => handleChange( e.target.dataset.id )}>{genre.name} <BadgeX>{genre.items.length}</BadgeX></Button>
							</ItemX>
						)

					}

					return false

				} )}
			</ListX>
		</WrapperX>
	)

}

Sidebar.propTypes = {
	data: PropTypes.array,
	handleChange: PropTypes.func
}

Sidebar.defaultProps = {
	data: []
}

export default Sidebar
