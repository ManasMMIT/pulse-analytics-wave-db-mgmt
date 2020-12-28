import React from 'react'

import {
  CREATE_LBM_SERVICE_CATEGORY,
  UPDATE_LBM_SERVICE_CATEGORY,
  DELETE_LBM_SERVICE_CATEGORY,
} from 'frontend/api/mutations'

import {
  GET_LBM_SERVICES_CATEGORIES,
  GET_VIEW_LBM_SERVICES,
} from 'frontend/api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

interface LbmServicesCategoriesModalProps extends ModalAndModalButtonSharedProps {
  closeModal: () => void
}

const LBM_SERVICES_CATEGORIES_BOID = '5fe35a551ba1c4203efe8912'
const HEADER_TEXT = 'LBM Services Categories'

const LbmServicesCategoriesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}: LbmServicesCategoriesModalProps) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={LBM_SERVICES_CATEGORIES_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_LBM_SERVICE_CATEGORY,
      update: UPDATE_LBM_SERVICE_CATEGORY,
      delete: DELETE_LBM_SERVICE_CATEGORY,
    }}
    refetchQueries={[
      ...refetchQueries!,
      { query: GET_LBM_SERVICES_CATEGORIES },
      { query: GET_VIEW_LBM_SERVICES },
    ]}
    afterMutationHook={afterMutationHook}
  />
)

LbmServicesCategoriesModal.defaultProps = {
  refetchQueries: [],
}

export default LbmServicesCategoriesModal
