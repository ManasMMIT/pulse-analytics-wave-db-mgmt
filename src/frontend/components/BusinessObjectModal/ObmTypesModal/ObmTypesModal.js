import React from 'react'

import {
  CREATE_OBM_TYPE,
  UPDATE_OBM_TYPE,
  DELETE_OBM_TYPE,
} from 'frontend/api/mutations'

import { GET_OBM_TYPES } from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const OBM_TYPE_BOID = '5fb2978ee9e85c26fe9503c7'
const HEADER_TEXT = 'OBM Types'

const ObmTypesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={OBM_TYPE_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_OBM_TYPE,
      update: UPDATE_OBM_TYPE,
      delete: DELETE_OBM_TYPE,
    }}
    refetchQueries={[...refetchQueries, { query: GET_OBM_TYPES }]}
    afterMutationHook={afterMutationHook}
  />
)

ObmTypesModal.defaultProps = {
  refetchQueries: [],
}

export default ObmTypesModal
