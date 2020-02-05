import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import {
  BULK_IMPORT_PROVIDER_ORGANIZATIONS,
} from '../../../../api/mutations'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from '../../../../api/queries'

import ImportButton from '../../../../components/ImportButton'

const ProviderImportButton = () => {
  const [bulkImportProviderOrganizations] = useMutation(BULK_IMPORT_PROVIDER_ORGANIZATIONS)

  const bulkImportOnClick = data => bulkImportProviderOrganizations({
    variables: { data },
    refetchQueries: [
      { query: GET_PROVIDER_ORGANIZATIONS },
      { query: GET_PATHWAYS_ORGANIZATIONS },
      { query: GET_APM_ORGANIZATIONS },
    ]
  })

  return (
    <ImportButton
      onClick={bulkImportOnClick}
    />
  )
}

export default ProviderImportButton