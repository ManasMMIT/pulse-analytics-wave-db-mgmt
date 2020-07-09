import React from 'react'

import { CREATE_PATHWAYS_ORGANIZATION, UPDATE_PATHWAYS_ORGANIZATION } from 'frontend/api/mutations'
import { GET_PATHWAYS_ORGANIZATIONS } from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const PATHWAYS_BOID = '5eac3251ac8a01743081f28d'
const HEADER_TEXT = 'Pathways Accounts'

const PathwaysModal = ({ closeModal, entityId, refetchQueries, afterMutationHook }) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={PATHWAYS_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => entity.organization}
    mutationDocs={{
      create: CREATE_PATHWAYS_ORGANIZATION,
      update: UPDATE_PATHWAYS_ORGANIZATION,
    }}
    refetchQueries={[...refetchQueries, { query: GET_PATHWAYS_ORGANIZATIONS }]}
    afterMutationHook={afterMutationHook}
  />
)

PathwaysModal.defaultProps = {
  refetchQueries: [],
}

export default PathwaysModal
