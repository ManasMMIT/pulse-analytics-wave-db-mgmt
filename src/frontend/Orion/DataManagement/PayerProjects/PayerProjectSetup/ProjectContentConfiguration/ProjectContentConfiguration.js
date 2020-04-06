import React from 'react'

import ProjectDetails from './ProjectDetails'
import ProjectContentConfigurationButton from './ProjectContentConfigurationButton'
import SectionCard from '../../SectionCard'

const CARD_TITLE = "Project Content Configuration"
const CARD_SUBTITLE = "Select your payers, indications and regimens for the project. Choosing an indication and regimen will create a Payer Treatment Plan. \nPayer Treatment Plans can be edited by clicking the Configure Project Content button."

const ProjectContentConfiguration = ({ projectId }) => {
  const leftHeaderContent = (
    <ProjectContentConfigurationButton projectId={projectId} />
  )

  return (
    <SectionCard
      title={CARD_TITLE}
      subtitle={CARD_SUBTITLE}
      leftHeaderContent={leftHeaderContent}
    >
      <ProjectDetails projectId={projectId} />
    </SectionCard>
  )
}

export default ProjectContentConfiguration