import styled from 'styled-components'
import Button from '../components/button'

export const ContainerX = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	align-items: stretch;

`

export const WrapperX = styled.div`
	flex: 1 0 300px;

	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: stretch;
`

export const HeaderX = styled.div`
	flex: 0 0 80px;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: ${props => props.theme.headerColor};
	background: ${props => props.theme.headerBgColor};
`

export const MainX = styled.div`
	flex: 1 1 100%;
	display: flex;
	flex-direction: row;
	overflow: hidden;
`

export const DisplayX = styled.div`
	flex: 1 1 80%;

	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: flex-start;

    transition-property: color, background-color;
    color: ${props => props.theme.displayColor};
    background-color: ${props => props.theme.displayBgColor};
`

export const ShuffleButtonX = styled( Button )`
	display: flex;
`

export const SortWrapperX = styled.div`
	flex: 0 0 60px;

	display: flex;
	flex-direction: row;
	align-items: center;
`
