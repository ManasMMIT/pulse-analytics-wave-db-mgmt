import { GET_OBM_KEY_EVENTS } from 'frontend/api/queries'

import { useQuery } from '@apollo/client'

const useObmKeyEvents = (args = {}) => {
  const { obmId } = args
  const { data, loading } = useQuery(GET_OBM_KEY_EVENTS)

  if (loading) return { data: [], loading }

  const payload = Object.values(data)[0]

  if (!obmId) return { data: payload, loading }

  const filteredData = payload.filter(
    ({ obmId: localObmId }) => obmId === localObmId
  )

  return {
    data: filteredData,
    loading,
  }
}

export default useObmKeyEvents
