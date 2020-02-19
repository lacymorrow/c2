import styled from 'styled-components';

const _Wrapper = styled.div`
	background: blue;
`
export default (props) => {
	const {data, handleChange} = props;

	return (
		<_Wrapper>
			<span className="glyphicon glyphicon-search" aria-hidden="true"></span>
			<input type="text" placeholder="Movies directory" value={data} onChange={handleChange} />
		</_Wrapper>
	);
};
