import React from 'react'

import SectionCard from '../SectionCard'
import Button from '../../../../components/Button'

const CARD_TITLE = "Project Content Configuration"
const CARD_SUBTITLE = "Select your payers, indications and regimens for the project. Choosing an indication and regimen will create a Payer Treatment Plan. \nPayer Treatment Plans can be edited by clicking the Configure Project Content button."

const ProjectContentConfiguration = () => {
  const leftHeaderContent = (
    <Button
      type="secondary"
      onClick={() => {}}
    >
      Configure Project Content
    </Button>
  )

  return (
    <SectionCard
      title={CARD_TITLE}
      subtitle={CARD_SUBTITLE}
      leftHeaderContent={leftHeaderContent}
    >
      <div>Content</div>
    </SectionCard>
  )
}

export default ProjectContentConfiguration