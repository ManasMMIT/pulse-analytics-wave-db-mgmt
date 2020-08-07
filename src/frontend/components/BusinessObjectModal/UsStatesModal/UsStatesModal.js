import React from 'react'

import {
  CREATE_US_STATE,
  UPDATE_US_STATE,
  DELETE_US_STATE,
} from 'frontend/api/mutations'

import { GET_US_STATES } from 'frontend/api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const US_STATE_BOID = '5f29d373b632504434da0f90'
const HEADER_TEXT = 'US States'

const UsStatesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={US_STATE_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => entity.stateLong}
    mutationDocs={{
      create: CREATE_US_STATE,
      update: UPDATE_US_STATE,
      delete: DELETE_US_STATE,
    }}
    refetchQueries={[...refetchQueries, { query: GET_US_STATES }]}
    afterMutationHook={afterMutationHook}
  />
)

UsStatesModal.defaultProps = {
  refetchQueries: [],
}

export default UsStatesModal
