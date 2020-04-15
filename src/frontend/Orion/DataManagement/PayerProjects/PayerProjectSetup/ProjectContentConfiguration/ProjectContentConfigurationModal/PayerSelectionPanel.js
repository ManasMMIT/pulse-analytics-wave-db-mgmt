import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import {
  GET_PAYER_ORGANIZATIONS,
} from '../../../../../../api/queries'

const PayerSelectionPanel = ({
  setPayerIds,
}) => {
  const { data, loading } = useQuery(GET_PAYER_ORGANIZATIONS)

  if (loading) return 'Loading...'

  const { payerOrganizations } = data

  return null
}

export default PayerSelectionPanel
