import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import { GET_PATHWAYS_ORGANIZATIONS } from './../../../api/queries'

import PathwaysModalButton from './../../../components/BusinessObjectModal/PathwaysModal/PathwaysModalButton'

const PathwaysRow = styled.div({
  padding: '8px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(10, 46, 77, 0.1)',
})

const NewAccounts = () => {
  const { data, loading } = useQuery(GET_PATHWAYS_ORGANIZATIONS)
  if (loading) return null

  const { pathwaysOrganizations } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <h2 style={{ padding: '0px 24px' }}>Pathways New Accounts</h2>
      <div>
        {pathwaysOrganizations.map(org => (
          <PathwaysRow key={org.slug}>
            <div>{org.slug}</div>
            <PathwaysModalButton entityId={org._id}> Edit </PathwaysModalButton>
          </PathwaysRow>
        ))}
      </div>
    </div>
  )
}

export default NewAccounts
