import React from 'react'
import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks'

import {
  GET_ACCOUNTS_DIFF,
} from '../../../../../../api/queries'

import {
  TOGGLE_ACCOUNT,
} from '../../../../../../api/mutations'

const AccountsTabContent = ({ nodeId, parentId, teamId }) => {
  const { data, loading, error } = useQuery(
    GET_ACCOUNTS_DIFF,
    { variables: { nodeId, parentId, teamId } }
  )
debugger
  const [toggleAccount] = useMutation(TOGGLE_ACCOUNT)

  if (loading || error) return null

  const { accountsDiff } = data

  const testAccount = accountsDiff.inactive[0]

  window.toggleAccount = () => toggleAccount({
    variables: {
        input: {
          teamId, nodeId, account: testAccount, shouldBeAdded: false
        }
      }
    })
  debugger

  return null
}

export default AccountsTabContent
