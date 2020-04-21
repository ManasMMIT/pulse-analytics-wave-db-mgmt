import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'

import PayerSelectionPanel from './PayerSelectionPanel'
import TreatmentPlanSelectionPanel from './TreatmentPlanSelectionPanel'

import {
  UPDATE_PAYER_PROJECT_PTPS,
} from './../../../../../../api/mutations'

// ! TODOS:
// TODO 1: Read all Payers
// TODO 2: Read all TreatmentPlans, grouped by indications
// TODO 3: Allow selection and product of two categories to persist in state in array of [{ orgId, tpId }]
// TODO 4: Trigger mutation to add ptp to care list

// const mashTogetherPayersAndTps = (payerIds, tpIds) => {}

const ModalContent = () => {
  const [payerIds, setPayerIds] = useState([])
  const [treatmentPlanIds, setTreatmentPlanIds] = useState([])
  const {
    params: {
      projectId,
    },
  } = useRouteMatch()

  const [trackPtps, { loading, data }] = useMutation(UPDATE_PAYER_PROJECT_PTPS)

  // !only mash things together on mutation
  const submit = () => trackPtps({
    variables: {
      input: {
        projectId,
        ptps: [
          {
            organizationId: '5d825030cc80b15a9476b81a',
            treatmentPlanId: '5e907c11b4e5d9e58d3ed647',
          }
        ]
        // ptps: mashTogetherPayersAndTps(
        //   payerIds,
        //   treatmentPlanIds
        // )
      }
    }
  })

  return (
    <div style={{ display: 'flex' }}>
      <PayerSelectionPanel />
      <TreatmentPlanSelectionPanel />
      <button onClick={submit}>
        Submit Me
      </button>
    </div>
  )
}

export default ModalContent
