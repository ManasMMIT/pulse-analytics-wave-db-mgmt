import _ from 'lodash'
import { useQuery } from '@apollo/client'

import {
  GET_JOIN_OBMS_AND_PAYERS,
  GET_PAYER_ORGANIZATIONS,
} from 'frontend/api/queries'

const useObmAndPayerConnections = (args = {}) => {
  const { obmId } = args

  const { data, loading } = useQuery(GET_JOIN_OBMS_AND_PAYERS)

  const { data: payersData, loading: payersLoading } = useQuery(
    GET_PAYER_ORGANIZATIONS
  )

  if (loading || payersLoading)
    return { data: [], loading: loading || payersLoading }

  const connections = Object.values(data)[0]

  let filteredData = connections

  // Only filter if there's filter params passed in
  if (obmId) {
    filteredData = connections.filter(
      ({ obmId: localObmId }) => localObmId === obmId
    )
  }

  const allPayers = Object.values(payersData)[0]
  const payerOrgById = _.mapValues(_.keyBy(allPayers, '_id'), 'organization')
  const sortedConnections = _.sortBy(filteredData, ({ payerId }) =>
    payerOrgById[payerId].toLowerCase()
  )

  return {
    data: sortedConnections,
    loading,
  }
}

export default useObmAndPayerConnections
