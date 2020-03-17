import styled from 'styled-components'
import Button from '../components/button'

export const ContainerX = styled.div`
	display: flex;
	flex-direction: row;
	height: 100vh;
	align-items: stretch;

`

export const WrapperX = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	flex: 1 0 30px;
`

export const HeaderX = styled.div`
	flex: 0 0;
	display: flex;
	flex-direction: row;
	width: 100%;
	align-items: center;
	justify-content: space-between;
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

    transition-property: color, background-color;
    color: ${props => props.theme.displayColor};
    background-color: ${props => props.theme.displayBgColor};
`

export const ShuffleButtonX = styled( Button )`
	display: flex;
`

export const SortWrapperX = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`
