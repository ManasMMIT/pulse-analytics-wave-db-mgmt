import React from 'react'
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks'
import Switch from '@material-ui/core/Switch'

import {
  GET_TREATMENT_PLANS_DIFF,
} from '../../../../../../../api/queries'

import {
  TOGGLE_INDICATION,
  // TOGGLE_REGIMEN,
} from '../../../../../../../api/mutations'

const TreatmentPlansTabContent = ({ nodeId, parentId, teamId }) => {
  const { data, loading, error } = useQuery(
    GET_TREATMENT_PLANS_DIFF,
    { variables: { nodeId, parentId, teamId } }
  )

  const [toggleIndication] = useMutation(TOGGLE_INDICATION, {
    refetchQueries: [{
      query: GET_TREATMENT_PLANS_DIFF,
      variables: { nodeId, parentId, teamId }
    }]
  })

  // const [toggleRegimen] = useMutation(TOGGLE_REGIMEN, {
    // refetchQueries: [{
    //   query: GET_TREATMENT_PLANS_DIFF,
    //   variables: { nodeId, parentId, teamId }
    // }]
  // })

  if (loading) return 'Loading...'
  if (error) return `There was an error: ${error}`

  const { treatmentPlansDiff } = data

  const content = treatmentPlansDiff.map(ind => (
    <div key={ind._id} style={{ display: 'flex' }}>
      <div>
        <span style={{ fontWeight: 700 }}>{ind.name}</span>
        <Switch
          checked={ind.enabled}
          color="primary"
          value={ind._id}
          onChange={() => {
            toggleIndication({
              variables: {
                input: {
                  shouldBeAdded: !ind.enabled,
                  indication: ind,
                  teamId,
                  nodeId,
                  parentId,
                }
              }
            })
          }}
        />
      </div>
      <div>
        {
          ind.regimens.map(reg => (
            <div key={reg._id} >
              <span>{reg.name}</span>
              <Switch
                checked={reg.enabled}
                color="primary"
                value={reg._id}
                // onChange={() => {
                //   if (!ind.enabled) {
                //     toggleIndication({
                //       variables: {
                //         shouldBeAdded: !ind.enabled,
                //         indication: ind,
                //         teamId,
                //         nodeId,
                //         parentId,
                //       }
                //     })
                //   }

                //   toggleRegimen({
                //     variables: {
                //       shouldBeAdded: !reg.enabled,
                //       regimen: reg,
                //       indicationId: ind._id,
                //       teamId,
                //       nodeId,
                //       parentId,
                //     }
                //   })
                // }}
              />
            </div>
          ))
        }
      </div>
    </div>
  ))

  return (
    <div style={{ maxHeight: 600, overflow: 'auto' }}>
      {content}
    </div>
  )
}

export default TreatmentPlansTabContent
