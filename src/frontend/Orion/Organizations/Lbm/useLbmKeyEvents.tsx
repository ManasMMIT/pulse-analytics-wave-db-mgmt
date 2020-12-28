import { GET_LBM_KEY_EVENTS } from 'frontend/api/queries'

import { useQuery } from '@apollo/react-hooks'

const useLbmKeyEvents = (args = {}) => {
  const { lbmId }: { lbmId?: string } = args
  const { data, loading } = useQuery(GET_LBM_KEY_EVENTS)

  if (loading) return { data: [], loading }

  const payload: any = Object.values(data)[0]

  if (!lbmId) return { data: payload, loading }

  const filteredData = payload.filter(
    ({ lbmId: localLbmId }: { lbmId: string }) => lbmId === localLbmId
  )

  return {
    data: filteredData,
    loading,
  }
}

export default useLbmKeyEvents
