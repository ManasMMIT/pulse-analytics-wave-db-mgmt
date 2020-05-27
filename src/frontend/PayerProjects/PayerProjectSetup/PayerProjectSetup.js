import React from 'react'
import styled from '@emotion/styled'

import ProjectInfo from './ProjectInfo'
import ProjectContentConfiguration from './ProjectContentConfiguration'

import Color from 'frontend/utils/color'

const Wrapper = styled.div({
  background: Color.WHITE,
  width: '100%',
})

const PayerProjectSetup = props => {
  return (
    <Wrapper>
      <ProjectInfo name={props.projectName} />
      <ProjectContentConfiguration />
    </Wrapper>
  )
}

PayerProjectSetup.propTypes = {

}

export default PayerProjectSetup
