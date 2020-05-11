import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_CMS_PRIM_SPEC_COUNTS
} from './../../../../api/queries'

import Spinner from './../../../../Phoenix/shared/Spinner'

const CmsSpecialtyCounts = ({
  groupPracticePacId
}) => {
  const { data, loading } = useQuery(
    GET_CMS_PRIM_SPEC_COUNTS,
    {
      variables: {
        orgPacId: groupPracticePacId
      },
      fetchPolicy: 'network-only',
    }
  )

  if (!groupPracticePacId) return null
  if (loading) return <Spinner />

  const { cMsOrgPrimarySpecialtyCounts } = data

  return (
    <div style={{ overflowY: 'scroll' }}>
      {
        cMsOrgPrimarySpecialtyCounts.map(([specialty, count]) => {
          return (
            <>
              <div
                key={specialty}
                style={{
                  border: '1px solid black',
                  padding: 12,
                  display: 'flex',
                  background: 'white',
                  justifyContent: 'space-between'
                }}
              >
                <div>{specialty}</div>
                <div>{count}</div>
              </div>
            </>
          )
        })
      }
    </div>
  )
}

export default CmsSpecialtyCounts
