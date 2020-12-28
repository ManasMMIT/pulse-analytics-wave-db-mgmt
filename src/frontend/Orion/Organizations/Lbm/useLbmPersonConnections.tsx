import { GET_JOIN_LBMS_AND_PEOPLE } from 'frontend/api/queries'

import { useQuery } from '@apollo/react-hooks'

const useLbmPersonConnections = (args: { lbmId?: string, personId?: string }) => {
  const { lbmId, personId } = args || {}
  const { data, loading } = useQuery(GET_JOIN_LBMS_AND_PEOPLE)

  if (loading) return { data: [], loading }

  const payload: any = Object.values(data)[0]

  if (!lbmId && !personId) return { data: payload, loading }

  const filteredData = payload.filter(matchesParams(lbmId, personId))
  return {
    data: filteredData,
    loading,
  }
}

const matchesParams = (lbmId?: string, personId?: string) => {
  return ({ lbmId: localLbmId, personId: localPersonId }: { lbmId: string, personId: string }) => {
    if (lbmId && personId) {
      return localLbmId === lbmId && localPersonId === personId
    }

    return localLbmId === lbmId || localPersonId === personId
  }
}

export default useLbmPersonConnections
