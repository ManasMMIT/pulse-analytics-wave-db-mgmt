import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/client'

import FieldLabel from 'frontend/components/FieldLabel'
import Title from 'frontend/components/Title'
import Button from 'frontend/components/Button'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import SectionCard from '../SectionCard'
import ProjectDeleteButton from './ProjectDeleteButton'
import { UPDATE_PAYER_PROJECT_NAME } from 'frontend/api/mutations'
import { GET_SINGLE_PAYER_PROJECT, GET_PAYER_PROJECTS_LIST } from 'frontend/api/queries'

const StyledInput = styled.input({
  height: 30,
  width: 300,
  padding: Spacing.S3,
  background: Color.LIGHT_BLUE_GRAY_1,
  borderRadius: 4,
  ...FontSpace.FS2,
})

const generateDefaultContent = ({ projectName, toggleEditPanel }) => {
  const headerTitle = (
    <Title
      size="FS3"
      title="PAYER PROJECT"
      titleModifiers={[projectName]}
      titleStyle={{ padding: 0 }}
    />
  )

  const leftHeaderContent = (
    <>
      <Button
        onClick={() => toggleEditPanel(true)}
        type="secondary"
        color={Color.MEDIUM_GRAY_2}
        buttonStyle={{ marginRight: Spacing.S4 }}
      >
        Edit Project Name
      </Button>
      <ProjectDeleteButton />
    </>
  )

  return {
    headerTitle,
    leftHeaderContent,
    cardContent: null,
  }
}

const generateEditPanel = ({ closeHandler, projectName, setProjectName, saveHandler }) => {
  const onChange = (e) => setProjectName(e.target.value)

  const headerTitle = 'PAYER PROJECT'

  const leftHeaderContent = (
    <>
      <Button
        onClick={saveHandler}
        type="secondary"
        color={Color.GREEN}
        buttonStyle={{ marginRight: Spacing.S4 }}
      >
        Save + Close
      </Button>
      <Button onClick={closeHandler} type="secondary" color={Color.MEDIUM_GRAY_1}>
        Close
      </Button>
    </>
  )

  const cardContent = (
    <>
      <FieldLabel>Name</FieldLabel>
      <StyledInput type="text" value={projectName} onChange={onChange} />
    </>
  )

  return {
    headerTitle,
    leftHeaderContent,
    cardContent,
  }
}

const ProjectInfo = ({ projectName: defaultProjectName, projectId }) => {
  const [isEditPanelOpen, toggleEditPanel] = useState(false)
  const [projectName, setProjectName] = useState(defaultProjectName)

  const [saveHandler] = useMutation(UPDATE_PAYER_PROJECT_NAME, {
    variables: {
      input: {
        _id: projectId,
        name: projectName,
      },
    },
    refetchQueries: [
      {
        query: GET_SINGLE_PAYER_PROJECT,
        variables: { projectId },
      },
      {
        // To update Project List when selecting the back navigation button
        query: GET_PAYER_PROJECTS_LIST,
      },
    ],
    onCompleted: (result) => {
      toggleEditPanel(false)
    },
    onError: (e) => alert(`Write failure: ${e.message}`),
  })

  const closeHandler = () => {
    setProjectName(defaultProjectName)
    toggleEditPanel(false)
  }

  const { headerTitle, leftHeaderContent, cardContent } = isEditPanelOpen
    ? generateEditPanel({ projectName, closeHandler, saveHandler, setProjectName })
    : generateDefaultContent({ projectName, toggleEditPanel })

  return (
    <SectionCard title={headerTitle} leftHeaderContent={leftHeaderContent}>
      {cardContent}
    </SectionCard>
  )
}

ProjectInfo.propTypes = {
  projectName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
}

export default ProjectInfo
