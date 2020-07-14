import { GET_OBM_AND_PERSON_CONNECTIONS } from 'frontend/api/queries'

import { useQuery } from '@apollo/react-hooks'

const useObmPersonConnections = (args = {}) => {
  const { obmId, personId } = args
  const { data, loading } = useQuery(GET_OBM_AND_PERSON_CONNECTIONS)

  if (loading) return { data: [], loading }

  const payload = Object.values(data)[0]

  if (!obmId && !personId) return { data: payload, loading }

  const filteredData = payload.filter(matchesParams(obmId, personId))
  return {
    data: filteredData,
    loading,
  }
}

const matchesParams = (obmId, personId) => {
  return ({ obmId: localObmId, personId: localPersonId }) => {
    if (obmId && personId) {
      return localObmId === obmId && localPersonId === personId
    }

    return localObmId === obmId || localPersonId === personId
  }
}

export default useObmPersonConnections
