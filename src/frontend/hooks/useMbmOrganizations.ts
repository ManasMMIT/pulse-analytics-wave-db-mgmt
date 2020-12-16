import { useQuery } from '@apollo/react-hooks'

import {
  GET_OBM_ORGANIZATIONS,
  GET_LBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import stripTypename from '../Orion/shared/strip-typename'

interface MbmOrganization {
  _id: string;
  slug: string;
  organization: string;
  type: string;
}

const useMbmOrganizations = (): { data: undefined | { [key: string]: any }, loading: boolean } => {
  const { data: obmData, loading: obmDataLoading } = useQuery<MbmOrganization>(
    GET_OBM_ORGANIZATIONS
  )
  const { data: lbmData, loading: lbmDataLoading } = useQuery<MbmOrganization>(
    GET_LBM_ORGANIZATIONS
  )

  if (obmDataLoading || lbmDataLoading) {
    return { data: undefined, loading: true }
  }

  let combinedData = []
  if (obmData && lbmData) {
    const obms = Object.values(obmData)[0]
    const lbms = Object.values(lbmData)[0]

    combinedData = stripTypename(obms.concat(lbms))
  }

  return { data: { mbmOrganizations: combinedData }, loading: false }
}

export default useMbmOrganizations
