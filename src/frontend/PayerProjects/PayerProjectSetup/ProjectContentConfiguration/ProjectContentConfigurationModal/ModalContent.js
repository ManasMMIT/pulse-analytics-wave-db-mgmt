import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import {
  GET_PAYER_PROJECT_PTPS
} from 'frontend/api/queries'
import {
  UPDATE_PAYER_PROJECT_PTPS,
} from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import SubmitButton from 'frontend/components/SubmitButton'

import PayerSelectionPanel from './PayerSelectionPanel'
import TreatmentPlanSelectionPanel from './TreatmentPlanSelectionPanel'

const ModalContent = ({
  initialPayerIds,
  initialTpIds,
  closeModal,
}) => {
  const [payerIds, setPayerIds] = useState(initialPayerIds)
  const [treatmentPlanIds, setTreatmentPlanIds] = useState(initialTpIds)

  const stagedPayerIds = Object.keys(payerIds)
  const stagedTpIds = Object.keys(treatmentPlanIds)

  const { projectId } = useParams()

  const [updatePtps, { loading }] = useMutation(
    UPDATE_PAYER_PROJECT_PTPS,
    {
      variables: {
        input: {
          projectId,
          organizationIds: stagedPayerIds,
          treatmentPlanIds: stagedTpIds,
        }
      },
      refetchQueries: [
        {
          query: GET_PAYER_PROJECT_PTPS,
          variables: { input: { projectId } }
        }
      ],
      awaitRefetchQueries: true,
      onCompleted: () => closeModal(),
    }
  )

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex' }}>
        <PayerSelectionPanel
          payerIds={payerIds}
          setPayerIds={setPayerIds}
        />
        <TreatmentPlanSelectionPanel
          treatmentPlanIds={treatmentPlanIds}
          setTreatmentPlanIds={setTreatmentPlanIds}
        />
      </div>

      <SubmitButton
        style={{ margin: 12 }}
        onClick={updatePtps}
      >
        { loading ? <Spinner /> : 'Submit' }
      </SubmitButton>
    </div>
  )
}

export default ModalContent
