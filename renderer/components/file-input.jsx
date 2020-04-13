import React from 'react'
import styled from 'styled-components'

import { IoIosFolderOpen } from 'react-icons/io'

import ipc from '../helpers/safe-ipc'
import strings from '../helpers/strings'
import Button from './button'

const WrapperX = styled.div`
	transition-property: color, background-color;
	color: ${props => props.theme.headerColor};
	background-color: ${props => props.theme.headerBgColor};

	position: relative;
`

const IconX = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: .5rem;

	display: flex;
	align-items: center;
	flex-direction: row;
`

const FileInput = () => {

	const handleChooseDirectory = () => ipc.send( 'open-file-dialog' )

	return (
		<WrapperX>
			<Button handleChange={handleChooseDirectory}>
				{strings.directory.button}
				<IconX><IoIosFolderOpen size={24}/></IconX>
			</Button>
		</WrapperX>
	)

}

export default FileInput
