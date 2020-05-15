import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

const Placard = styled.div({
  border: `1px solid ${ Colors.BLACK }`,
  padding: Spacing.NORMAL,
  margin: Spacing.NORMAL,
  width: '20%',
})

const ProjectPlacard = ({
  projectName,
  projectId,
}) => {
  return (
    <Placard>
      <Link
        to={`/payer-projects/${ projectId }/import-historical-data`}
      >
      { projectName }
      </Link>
    </Placard>
  )
}

ProjectPlacard.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default ProjectPlacard