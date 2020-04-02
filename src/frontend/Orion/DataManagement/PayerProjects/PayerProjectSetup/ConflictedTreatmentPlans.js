import React from 'react'

import SectionCard from '../SectionCard'

const CARD_TITLE = "Conflicted Payer Treatment Plans"
const CARD_SUBTITLE = "The following Payer Treatment Plans have not been added to your project. This means you can not import this data from your workbook."

const ProjectContentConfiguration = () => {
  return (
    <SectionCard
      title={CARD_TITLE}
      subtitle={CARD_SUBTITLE}
    >
      <div>Content</div>
    </SectionCard>
  )
}

export default ProjectContentConfiguration