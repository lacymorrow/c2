import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import strings from '../helpers/strings'

import Button from './sidebar-button'
import Logo from './logo'

const WrapperX = styled.div`
	flex: 0 0 20%;
	transition: color .6s ease-out, background-color .6s ease-out;
	color: ${props => props.theme.sidebarColor};
	background-color: ${props => props.theme.sidebarBgColor};
`

const ListX = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`

const ItemX = styled.li`

`

const LabelX = styled.p`
	font-weight: 700;
	width: 100%;
	padding: 0 2rem;
`

const BadgeX = styled.span`
	transition: color .6s ease-out, background-color .6s ease-out;
	background-color: ${props => props.theme.highlightColor};
	color: ${props => props.theme.sidebarBgColor};


	vertical-align: middle;
	white-space: nowrap;
	text-align: center;
	border-radius: 20px;
	padding: .2rem .5rem;
`

const Sidebar = props => {

	const { data, handleChange, current, movieCount } = props

	return (
		<WrapperX>
			<Logo/>
			<ListX>
				<ItemX>
					<LabelX>{strings.sidebar.label} {movieCount && ( <BadgeX>{movieCount}</BadgeX> )}</LabelX>
				</ItemX>

				<ItemX>
					<Button active={current === 'movies'} data-active={current === 'movies'} handleChange={() => handleChange( 'movies' )}>{strings.sidebar.main}</Button>
				</ItemX>

				<ItemX>
					<LabelX>Genres</LabelX>
				</ItemX>

				{data && data.map( genre => {

					if ( genre.items.length > 0 ) {

						return (
							<ItemX key={genre._id}>
								<Button active={current === genre._id} data-id={genre._id} handleChange={e => handleChange( e.currentTarget.dataset.id )}>
									{genre.name}
									{/* <BadgeX>{genre.items.length}</BadgeX> */}
								</Button>
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
	current: PropTypes.string,
	data: PropTypes.array,
	handleChange: PropTypes.func,
	movieCount: PropTypes.number
}

Sidebar.defaultProps = {
	data: []
}

export default Sidebar
