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

export const DisplayX = styled.div`
	flex: 1 0 60%;
	background: green;
`

export const DetailsX = styled.div`
	flex: 1 0 0;
	background: orange;
	transition: all 3s ease;
`
