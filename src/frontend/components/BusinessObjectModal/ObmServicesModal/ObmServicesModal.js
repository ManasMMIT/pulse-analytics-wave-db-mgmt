import React from 'react'

import {
  CREATE_OBM_SERVICE,
  UPDATE_OBM_SERVICE,
} from 'frontend/api/mutations'

import {
  GET_OBM_SERVICES,
} from '../../../api/queries'

import ObmServiceCategoryWidget from './relational-widgets/ObmServiceCategoryWidget'
import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const OBM_SERVICES_BOID = '5ed81e5fb8ebf33703463750'
const HEADER_TEXT = 'OBM Services'

const WIDGETS = [
  {
    _id: 'RELATIONAL_obmServiceCategoryWidget',
    label: 'Connect to OBM Service Category',
    Component: ObmServiceCategoryWidget,
  },
]

const ObmServicesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={OBM_SERVICES_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_OBM_SERVICE,
      update: UPDATE_OBM_SERVICE,
    }}
    refetchQueries={[...refetchQueries, { query: GET_OBM_SERVICES }]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

ObmServicesModal.defaultProps = {
  refetchQueries: [],
}

export default ObmServicesModal
