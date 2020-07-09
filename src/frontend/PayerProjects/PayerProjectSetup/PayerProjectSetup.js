import PropTypes from 'prop-types'
import React from 'react'
import { useParams } from 'react-router-dom'
import styled from '@emotion/styled'

import ProjectInfo from './ProjectInfo'
import ProjectContentConfiguration from './ProjectContentConfiguration'

import Color from 'frontend/utils/color'

const Wrapper = styled.div({
  background: Color.WHITE,
  width: '100%',
})

const PayerProjectSetup = ({ projectName }) => {
  const { projectId } = useParams()
  return (
    <Wrapper>
      <ProjectInfo projectName={projectName} projectId={projectId} />
      <ProjectContentConfiguration />
    </Wrapper>
  )
}

PayerProjectSetup.propTypes = {
  projectName: PropTypes.string.isRequired,
}

export default PayerProjectSetup
