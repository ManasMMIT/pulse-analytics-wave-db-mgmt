import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import _ from 'lodash'

import ModalContent from './ModalContent'
import Modal from 'frontend/components/Modal'
import Title from 'frontend/components/Title'
import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'
import {
  GET_PAYER_PROJECT_PTPS
} from 'frontend/api/queries'

const MODAL_TITLE = "PROJECT CONTENT CONFIGURATION"
const TITLE_MODIFIERS = ["Payer + Treatment Plan Section"]

const modalStyle = {
  width: '90%'
}

const Subtitle = styled.div({
  color: Color.BLACK,
  fontWeight: 500,
  ...FontSpace.FS2,
})

const title = (
  <>
    <Title
      size="FS3"
      title={MODAL_TITLE}
      titleModifiers={TITLE_MODIFIERS}
      titleStyle={{ padding: 0 }}
    />
    <Subtitle>
      To create a Treatment Plan, select a Payer followed by an Indication. Once selected, click the toggle to add to your preferred Treatment Plan.
          </Subtitle>
  </>
)

const ProjectContentConfigurationModal = ({ isModalOpen, closeModal }) => {
  const { projectId } = useParams()

  const { data, loading } = useQuery(
    GET_PAYER_PROJECT_PTPS,
    {
      variables: {
        input: { projectId }
      },
    }
  ) // ! should always be `loading: false`

  if (loading) return null

  const { payerProjectPtps } = data

  const initialPayerIds = _.keyBy(payerProjectPtps, 'organizationId')
  const initialTpIds = _.keyBy(payerProjectPtps, 'treatmentPlanId')

  return (
    <Modal
      show={isModalOpen}
      handleClose={closeModal}
      modalStyle={modalStyle}
      title={title}
    >
      <ModalContent
        initialPayerIds={initialPayerIds}
        initialTpIds={initialTpIds}
        closeModal={closeModal}
      />
    </Modal>
  )
}

export default ProjectContentConfigurationModal
