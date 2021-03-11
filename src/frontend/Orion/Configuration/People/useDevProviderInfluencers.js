import { useQuery } from '@apollo/client'

import { GET_DEV_PROVIDER_INFLUENCERS } from 'frontend/api/queries'

const useDevProviderInfluencers = (args = {}) => {
  const { personId } = args

  const { data, loading } = useQuery(GET_DEV_PROVIDER_INFLUENCERS, {
    fetchPolicy: 'network-only',
  })

  if (loading) return { data: [], loading }

  const payload = Object.values(data)[0]

  if (!personId) return { data: payload, loading }

  return {
    data: payload.filter(
      ({ personId: localPersonId }) => localPersonId === personId
    ),
    loading,
  }
}

export default useDevProviderInfluencers
