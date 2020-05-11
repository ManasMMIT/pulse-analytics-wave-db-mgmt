import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { GET_SOURCE_TREATMENT_PLANS } from 'frontend/api/queries'

import Modal from 'frontend/components/Modal'
import Color from 'frontend/utils/color'
import {
  Colors,
  Spacing,
  Transitions,
  FontFamily,
} from 'frontend/utils/pulseStyles'

import TreatmentPlanForm from './TreatmentPlanForm'

const StyledButton = styled.button({
  background: transparentize(0.1, Colors.PRIMARY),
  border: 'none',
  borderRadius: 4,
  padding: '8px 12px',
  color: Colors.WHITE,
  cursor: 'pointer',
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: 'left',
  ':hover': {
    background: transparentize(0.9, Colors.PRIMARY),
    color: Colors.PRIMARY,
  },
  ':focus': {
    outline: 'none',
  }
})

export const SubmitButton = styled.button({
  fontFamily: FontFamily.NORMAL,
  placeSelf: 'flex-end',
  cursor: 'pointer',
  padding: `${Spacing.SMALL} ${Spacing.NORMAL}`,
  transition: Transitions.NORMAL,
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: 4,
  background: Color.GREEN,
  color: Color.WHITE,
  fontWeight: 600,
  fontSize: 12,
  marginLeft: 12,
  ':hover': {
    background: transparentize(0.2, Color.GREEN),
  }
})

const TreatmentPlanModalButton = ({
  data = {},
  treatmentPlanParts,
  buttonLabel,
  modalStyle,
  modalTitle,
  submitMutation,
}) => {
  const [state, setState] = useState(data)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setState(data) // ! make sure to reset modal
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const [save] = useMutation(
    submitMutation,
    {
      variables: {
        input: {
          indication: (state.indication || {})._id,
          regimen: (state.regimen || {})._id,
          line: (state.line || {})._id,
          population: (state.population || {})._id,
          book: (state.book || {})._id,
          coverage: (state.coverage || {})._id,
        },
      },
      refetchQueries: [{ query: GET_SOURCE_TREATMENT_PLANS }],
      onCompleted: () => {
        closeModal()
      }
    }
  )

  const submitButton = (
    <SubmitButton onClick={save}>
      {'save + close'}
    </SubmitButton>
  )

  return (
    <>
      <StyledButton onClick={openModal} >
        {buttonLabel}
      </StyledButton>
      <Modal
        submitButton={submitButton}
        modalStyle={modalStyle}
        handleClose={closeModal}
        show={isModalOpen}
        title={modalTitle}
      >
        <TreatmentPlanForm
          stateHook={[state, setState]}
          treatmentPlanParts={treatmentPlanParts}
        />
      </Modal>
    </>
  )
}

export default TreatmentPlanModalButton
