import React from 'react'

import {
  CREATE_OBM_SERVICE_CATEGORY,
  UPDATE_OBM_SERVICE_CATEGORY,
  DELETE_OBM_SERVICE_CATEGORY,
} from 'frontend/api/mutations'

import {
  GET_OBM_SERVICES_CATEGORIES,
  GET_VIEW_OBM_SERVICES,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const OBM_SERVICES_CATEGORIES_BOID = '5ed81ed8bcfdf6381562c17e'
const HEADER_TEXT = 'OBM Services Categories'

const ObmServicesCategoriesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    isVega
    closeModal={closeModal}
    entityId={entityId}
    boId={OBM_SERVICES_CATEGORIES_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_OBM_SERVICE_CATEGORY,
      update: UPDATE_OBM_SERVICE_CATEGORY,
      delete: DELETE_OBM_SERVICE_CATEGORY,
    }}
    refetchQueries={[
      ...refetchQueries,
      { query: GET_OBM_SERVICES_CATEGORIES },
      { query: GET_VIEW_OBM_SERVICES },
    ]}
    afterMutationHook={afterMutationHook}
  />
)

ObmServicesCategoriesModal.defaultProps = {
  refetchQueries: [],
}

export default ObmServicesCategoriesModal
