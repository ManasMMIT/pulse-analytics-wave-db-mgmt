import { useQuery } from '@apollo/react-hooks'

import { GET_DEV_PATHWAYS_INFLUENCERS } from 'frontend/api/queries'

const useDevPathwaysInfluencers = (args = {}) => {
  const { personId } = args

  const { data, loading } = useQuery(GET_DEV_PATHWAYS_INFLUENCERS)

  if (loading) return { data: [], loading }

  const payload = Object.values(data)[0]

  if (!personId) return { data: payload, loading }

  return {
    data: payload.filter(({ personId: localPersonId }) => localPersonId === personId),
    loading,
  }
}

export default useDevPathwaysInfluencers
