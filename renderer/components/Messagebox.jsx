import styled from 'styled-components';

const _Wrapper = styled.div`
	background: teal;
`
export default (props) => {
	const {data} = props;

	return (
		<_Wrapper>
			<p>{data}</p>
		</_Wrapper>
	);
};
