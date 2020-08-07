import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const NoDataPlaceholder = () => <Wrapper>No Data Available</Wrapper>

export default NoDataPlaceholder
