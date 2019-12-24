import { useQuery } from '@apollo/react-hooks'

import {
  GET_APM_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
} from '../../../api/queries'

const ACCOUNT_TYPE_OPTIONS = [
  'Payer',
  'Provider',
  'Pathways',
  'Alternative Payment Model',
]

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

  if (loading) return ({ loading })

  const accountFilterOptions = [
    ...ApmData.apmOrganizations,
    ...PathwaysData.pathwaysOrganizations,
    ...PayerData.payerOrganizations,
    ...ProviderData.providerOrganizations,
  ].map(({ _id, organization, type }) => ({
    value: _id,
    label: `${organization} (${type})`,
  }))

  const orgTypeFilterOptions = ACCOUNT_TYPE_OPTIONS
    .map(accountType => ({
      value: accountType,
      label: accountType,
    }))

  const data = {
    orgTypeFilterOptions,
    accountFilterOptions,
  }

  return ({
    loading,
    data,
  })
}
