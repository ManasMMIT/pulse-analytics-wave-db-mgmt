import React from 'react'

import {
  CREATE_APM_ORGANIZATION,
  UPDATE_APM_ORGANIZATION,
  DELETE_APM_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_EVENTS,
  // GET_JOIN_APM_AND_PEOPLE,
  GET_APM_ORGANIZATIONS,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const APM_BOID = '5eac39250cce12751670c82f'
const HEADER_TEXT = 'Alternative Payment Model Accounts'

const ApmsModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={APM_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => entity.organization}
    mutationDocs={{
      create: CREATE_APM_ORGANIZATION,
      update: UPDATE_APM_ORGANIZATION,
      delete: DELETE_APM_ORGANIZATION,
    }}
    refetchQueries={[
      ...refetchQueries,
      // { query: GET_JOIN_APM_AND_PEOPLE },
      { query: GET_APM_ORGANIZATIONS },
      { query: GET_EVENTS },
    ]}
    afterMutationHook={afterMutationHook}
  />
)

ApmsModal.defaultProps = {
  refetchQueries: [],
}

export default ApmsModal
