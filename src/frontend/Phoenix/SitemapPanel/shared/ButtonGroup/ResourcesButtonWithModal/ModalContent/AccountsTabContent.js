import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_ACCOUNTS_DIFF } from '../../../../../../api/queries'

const AccountsTabContent = ({ nodeId, parentId, teamId }) => {
  const { data, loading, error } = useQuery(
    GET_ACCOUNTS_DIFF,
    { variables: { nodeId, parentId, teamId } }
  )

  if (loading || error) return null

  const { accountsDiff } = data
  debugger

  return null
}

export default AccountsTabContent
