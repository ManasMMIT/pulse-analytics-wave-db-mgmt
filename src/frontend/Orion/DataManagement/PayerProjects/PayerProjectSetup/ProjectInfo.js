import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import SectionCard from '../SectionCard'
import FieldLabel from '../../../../components/FieldLabel'
import Title from '../../../../components/Title'
import Button from '../../../../components/Button'

import Color from '../../../../utils/color'
import Spacing from '../../../../utils/spacing'
import FontSpace from '../../../../utils/fontspace'

const StyledInput = styled.input({
  height: 30,
  width: 300,
  padding: Spacing.S3,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
  ...FontSpace.FS2,
})

const generateDefaultContent = ({ name, toggleEditPanel }) => {
  const headerTitle = (
    <Title
      size="FS3"
      title="PAYER PROJECT"
      titleModifiers={[name]}
      titleStyle={{ padding: 0 }}
    />
  )

  const leftHeaderContent = (
    <Button
      onClick={() => toggleEditPanel(true)}
      type="secondary"
      color={Color.MEDIUM_GRAY_2}
    >
      Edit Project Name
    </Button>

  )

  return {
    headerTitle,
    leftHeaderContent, 
    cardContent: null 
  }
}

const generateEditPanel = ({
  toggleEditPanel,
  projectName,
  setProjectName
}) => {
  const onChange = e => setProjectName(e.target.value)
  
  const headerTitle = "PAYER PROJECT"

  const leftHeaderContent = (
    <Button
      onClick={() => toggleEditPanel(false)}
      type="secondary"
      color={Color.MEDIUM_GRAY_1}
    >
      Close
    </Button>
  )

  const cardContent = (
    <>
      <FieldLabel>
        Name
      </FieldLabel>
      <StyledInput type="text" value={projectName} onChange={onChange} />
    </>
  )

  return {
    headerTitle,
    leftHeaderContent,
    cardContent
  }
}

const ProjectInfo = ({ name }) => {
  const [isEditPanelOpen, toggleEditPanel] = useState(false)
  const [projectName, setProjectName] = useState(name)

  const { headerTitle, leftHeaderContent, cardContent } = isEditPanelOpen
    ? generateEditPanel({ name, toggleEditPanel, projectName, setProjectName })
    : generateDefaultContent({ name, toggleEditPanel })

  return (
    <SectionCard
      title={headerTitle}
      leftHeaderContent={leftHeaderContent}
    >
      { cardContent }
    </SectionCard>
  )
}

ProjectInfo.propTypes = {
  name: PropTypes.string.isRequired,
}

export default ProjectInfo