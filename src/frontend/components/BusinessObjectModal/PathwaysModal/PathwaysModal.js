import React from 'react'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const PATHWAYS_BOID = '5e46a9784a5ab07ddbe3dc88'
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
