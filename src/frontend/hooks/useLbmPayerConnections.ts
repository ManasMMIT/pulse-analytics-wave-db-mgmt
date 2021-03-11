import _ from 'lodash'
import { useQuery } from '@apollo/client'

import {
  GET_JOIN_LBMS_AND_PAYERS,
  GET_PAYER_ORGANIZATIONS,
} from 'frontend/api/queries'

interface LbmAndPayerConnection {
  _id: string
  lbmId: string
  payerId: string
  books: { _id: string, name: string, isNational: boolean, states: string[] }[]
  note: String
}

interface JoinLbmsPayersData {
  JOIN_lbms_payers: LbmAndPayerConnection[]
}

interface Payer {
  _id: string
  slug: string
  type: string
  organization: string
  organizationTiny: string
}

interface PayersData {
  payerOrganizations: Payer[]
}

const useLbmAndPayerConnections = (args: { lbmId?: string } = {}) => {
  const { lbmId } = args

  const { data, loading } = useQuery<JoinLbmsPayersData>(GET_JOIN_LBMS_AND_PAYERS)

  const { data: payersData, loading: payersLoading } = useQuery<PayersData>(
    GET_PAYER_ORGANIZATIONS
  )

  if (loading || payersLoading) return { data: [], loading: true }

  const connections = Object.values(data!)[0]

  let filteredData = connections
  // Only filter if there's filter params passed in
  if (lbmId) {
    filteredData = connections.filter(
      ({ lbmId: localLbmId }: { lbmId: string }) => localLbmId === lbmId
    )
  }

  const allPayers = Object.values(payersData!)[0]
  const payerOrgById = _.mapValues(_.keyBy(allPayers, '_id'), 'organization')
  const sortedConnections = _.sortBy(filteredData, ({ payerId }) =>
    payerOrgById[payerId].toLowerCase()
  )

  return {
    data: sortedConnections,
    loading,
  }
}

export default useLbmAndPayerConnections
