import styled from 'styled-components'
import Button from '../components/button'

export const ContainerX = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	align-items: stretch;
`

export const HeaderX = styled.div`
	flex: 0 0 100px;
	display: flex;
	flex-direction: row;
	width: 100%;
	color: ${props => props.theme.headerColor};
	background: ${props => props.theme.headerBgColor};
`

export const MainX = styled.div`
	flex: 1 1 100%;
	display: flex;
	flex-direction: row;
`

export const DisplayX = styled.div`
	flex: 1 1 80%;
`

export const ShuffleButtonX = styled( Button )`
	display: inline-block;
`
