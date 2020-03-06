import styled from 'styled-components'

export const ContainerX = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: stretch;
`

export const HeaderX = styled.div`
	flex: 1 1 100px;
	display: flex;
	flex-direction: row;
	width: 100%;
	background: gray;
`

export const MainX = styled.div`
	flex: 1 1 100%;
	display: flex;
	flex-direction: row;
`

export const SidebarX = styled.div`
	flex: 0 0 20%;
	color: ${props => props.theme.colorPrimary};
	background: ${props => props.theme.bgColorPrimary};
`

export const BadgeX = styled.span`
	color: red;
`

export const DisplayX = styled.div`
	flex: 1 1 100%;
	background: green;
`

export const DetailsX = styled.div`
	flex: 1 0 200px;
	background: orange;
	transition: all 3s ease;
`
