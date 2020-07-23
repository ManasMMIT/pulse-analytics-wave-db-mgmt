import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { darken, transparentize } from 'polished'

import Icon from 'frontend/components/Icon'
import { GET_PAYER_PROJECT_IMPORT_TIMESTAMPS } from 'frontend/api/queries'

import { formatDateMonthYearLong } from 'frontend/utils/formatDate'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import Transitions from 'frontend/utils/transitions'

const Placard = styled(Link)({
  padding: Spacing.S4,
  margin: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_2,
  height: 90,
  width: 300,
  borderRadius: 4,
  transition: `background ${Transitions.NORMAL}`,
  ':hover': {
    background: darken(0.1, Color.LIGHT_BLUE_GRAY_2),
  },
})

const ProjectName = styled.div({
  color: Color.BLACK,
  fontWeight: 600,
  ...FontSpace.FS3,
})

const LastImport = styled.div(
  {
    color: transparentize(0.4, Color.BLACK),
    fontWeight: 500,
    transition: `opacity ${Transitions.NORMAL}`,
    ...FontSpace.FS2,
  },
  ({ isVisible }) => ({
    opacity: isVisible ? 1 : 0,
  })
)

const View = styled.div({
  color: Color.BLUE,
  fontWeight: 500,
  ...FontSpace.FS2,
})

const ProjectPlacard = ({ projectName, projectId }) => {
  const [lastImportDate, setLastImportDate] = useState(null)

  const { data, loading } = useQuery(GET_PAYER_PROJECT_IMPORT_TIMESTAMPS, {
    variables: { projectId },
  })

  useEffect(() => {
    if (!loading) {
      const [
        sortedTimestamps,
      ] = data.payerProjectPtpsImportTimestamps.timestamps.sort().reverse()

      setLastImportDate(sortedTimestamps)
    }
  }, [loading])

  const formattedDate = lastImportDate
    ? formatDateMonthYearLong(lastImportDate)
    : null

  return (
    <Placard to={`/payer-projects/${projectId}/import-historical-data`}>
      <ProjectName>{projectName}</ProjectName>
      <LastImport isVisible={Boolean(formattedDate)}>
        Last Data Import: {formattedDate}
      </LastImport>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <View>View</View>
        <Icon
          iconName={'arrow-drop-right'}
          color1={Color.BLUE}
          height={16}
          width={18}
        />
      </div>
    </Placard>
  )
}

ProjectPlacard.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default ProjectPlacard
