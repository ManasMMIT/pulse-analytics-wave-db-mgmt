import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

import Icon from '../../../../components/Icon'

import Color from '../../../../utils/color'
import Spacing from '../../../../utils/spacing'
import FontSpace from '../../../../utils/fontspace'
import { formatDateMonthYearLong } from '../../../../utils/formatDate'

const Placard = styled.div({
  margin: Spacing.S4,
  padding: Spacing.S4,
  width: 340,
  background: Color.LIGHT_BLUE_GRAY_2,
  borderRadius: 4,
  fontWeight: 500,
})

const ProjectName = styled.div({
  ...FontSpace.FS3,
})

const LastImport = styled.div({
  opacity: 0.6,
  ...FontSpace.FS2,
})

const ViewContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  color: Color.BLUE,
  textAlign: 'right',
  ...FontSpace.FS2,
})

const ProjectPlacard = ({
  projectName,
  projectId,
  timestamps,
}) => {
  const sortedTimestamps = timestamps.sort().reverse()
  const latestTimestamp = formatDateMonthYearLong(sortedTimestamps[0])

  return (
    <Placard>
      <Link
        to={`/orion/data-management/payer-projects/${ projectId }`}
      >
        <ProjectName>
          { projectName }
        </ProjectName>
        <LastImport>
          { `Last Data Import: ${latestTimestamp}` }
        </LastImport>
        <ViewContainer>
          View { 
            <Icon
              iconName="arrow-drop-right"
              height={16}
              width={16}
              color1={Color.BLUE}
            /> 
          }
        </ViewContainer>
      </Link>
    </Placard>
  )
}

ProjectPlacard.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default ProjectPlacard