import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { darken } from 'polished'

import { Spacing } from 'frontend/utils/pulseStyles'

const Placard = styled(Link)({
  padding: Spacing.NORMAL,
  margin: Spacing.NORMAL,
  width: '20%',
  background: '#EEF4FA',
  borderRadius: 4,
  fontSize: 14,
  fontWeight:700,
  ':hover': {
    background: darken(0.1, '#EEF4FA'),
  }
})

const ProjectPlacard = ({
  projectName,
  projectId,
}) => {
  return (
    <Placard to={`/payer-projects/${ projectId }/import-historical-data`}>
      { projectName }
    </Placard>
  )
}

ProjectPlacard.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default ProjectPlacard
