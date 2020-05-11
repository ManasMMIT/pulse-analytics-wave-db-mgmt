/*
  ! The eventual purpose of this custom hook is to
    ! handle most (if not all) query tool hook logic for
    ! a more consistent hook API.
    
  ! The current logic will be moved into a sub-hook
    ! something like 'useAllAccounts`
*/

import { useQuery } from '@apollo/react-hooks'

import {
  GET_APM_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
} from '../../../api/queries'

export default () => {
  const {
    data: ApmData,
    loading: ApmLoading,
  } = useQuery(GET_APM_ORGANIZATIONS)

  const {
    data: PathwaysData,
    loading: PathwaysLoading,
  } = useQuery(GET_PATHWAYS_ORGANIZATIONS)

  const {
    data: PayerData,
    loading: PayerLoading,
  } = useQuery(GET_PAYER_ORGANIZATIONS)
  
  const {
    data: ProviderData,
    loading: ProviderLoading,
  } = useQuery(GET_PROVIDER_ORGANIZATIONS)

  const loading = [
    ApmLoading,
    PathwaysLoading,
    PayerLoading,
    ProviderLoading,
  ].some(loading => loading)

  let data = {}
  if (!loading) {
    data.queryToolAccounts = [
      ...ApmData.apmOrganizations,
      ...PathwaysData.pathwaysOrganizations,
      ...PayerData.payerOrganizations,
      ...ProviderData.providerOrganizations,
    ]
  }

  return ({
    loading,
    data
  })
}
