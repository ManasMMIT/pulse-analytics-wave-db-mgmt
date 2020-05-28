import React from 'react'

import {
  CREATE_OBM_ORGANIZATION,
  UPDATE_OBM_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_OBM_ORGANIZATIONS,
} from 'frontend/api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const OBM_BOID = '5ec81a40b2cfb87bb15373ec'
const HEADER_TEXT = 'Oncology Benefit Manager Accounts'

const OncologyBenefitManagerModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={OBM_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_OBM_ORGANIZATION,
      update: UPDATE_OBM_ORGANIZATION,
    }}
    refetchQueries={[...refetchQueries, { query: GET_OBM_ORGANIZATIONS }]}
    afterMutationHook={afterMutationHook}
  />
)

OncologyBenefitManagerModal.defaultProps = {
  refetchQueries: [],
}

export default OncologyBenefitManagerModal
