import React, { useState } from 'react'

import ProjectContentConfigurationModal from './ProjectContentConfigurationModal/ProjectContentConfigurationModal'
import Button from '../../../../../components/Button'

const ProjectContentConfigurationButton = () => {
  const [isModalOpen, toggleModal] = useState(false)

  const openModal = () => toggleModal(true)
  const closeModal = () => toggleModal(false)

  return (
    <>
      <Button
        onClick={openModal}
        type="secondary"
      >
        Configure Project Content
      </Button>
      <ProjectContentConfigurationModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  )
}

export default ProjectContentConfigurationButton
