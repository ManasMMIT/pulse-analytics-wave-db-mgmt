import React from 'react'

import {
  CREATE_LBM_TYPE,
  UPDATE_LBM_TYPE,
  DELETE_LBM_TYPE,
} from 'frontend/api/mutations'

import { GET_LBM_TYPES } from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

const LBM_TYPE_BOID = '5fdbd5b23c043d44ad4bf089'
const HEADER_TEXT = 'LBM Types'

interface LbmTypesModal extends ModalAndModalButtonSharedProps {
  closeModal: () => void
}

const LbmTypesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}: LbmTypesModal) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={LBM_TYPE_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_LBM_TYPE,
      update: UPDATE_LBM_TYPE,
      delete: DELETE_LBM_TYPE,
    }}
    refetchQueries={[...refetchQueries!, { query: GET_LBM_TYPES }]}
    afterMutationHook={afterMutationHook}
  />
)

LbmTypesModal.defaultProps = {
  refetchQueries: [],
}

export default LbmTypesModal
