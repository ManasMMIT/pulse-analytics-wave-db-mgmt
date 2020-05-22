import React from 'react'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const PATHWAYS_BOID = '5eac3251ac8a01743081f28d'
const HEADER_TEXT = 'Pathways Accounts'

const PathwaysModal = ({ closeModal, entityId }) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={PATHWAYS_BOID}
    headerText={HEADER_TEXT}
  />
)

export default PathwaysModal
