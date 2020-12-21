import React from 'react'

import {
  CREATE_LBM_ORGANIZATION,
  UPDATE_LBM_ORGANIZATION,
  DELETE_LBM_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_LBM_ORGANIZATIONS,
  // GET_VIEW_OBM_SERVICES,
  // GET_VIEW_OBM_PAYER_PARTNERSHIPS,
  // GET_VIEW_OBM_INFLUENCERS,
} from 'frontend/api/queries'

// import ObmServicesWidget from './relational-widgets/ObmServicesWidget'
// import ObmInfluencersWidget from './relational-widgets/ObmInfluencersWidget'
// import ObmPayersWidget from './relational-widgets/ObmPayersWidget'
import LbmTypesWidget from './relational-widgets/LbmTypesWidget'
// import ObmKeyEventsWidget from './relational-widgets/ObmKeyEventsWidget'
import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

const LBM_BOID = '5fdb8b4dc1587918d2033dea'
const HEADER_TEXT = 'Laboratory Benefit Manager Accounts'

const WIDGETS = [
  {
    _id: 'RELATIONAL_lbmTypesWidget',
    label: 'Connect to LBM Type',
    Component: LbmTypesWidget,
  },
//   {
//     _id: 'RELATIONAL_obmServicesWidget',
//     label: 'Connect to OBM Services',
//     Component: ObmServicesWidget,
//   },
//   {
//     _id: 'RELATIONAL_obmInfluencersWidget',
//     label: 'Connect to OBM Influencers',
//     Component: ObmInfluencersWidget,
//   },
//   {
//     _id: 'RELATIONAL_obmPayersWidget',
//     label: 'Connect to Payers',
//     Component: ObmPayersWidget,
//   },
//   {
//     _id: 'RELATIONAL_obmKeyEvents',
//     label: 'Manage Key Events',
//     Component: ObmKeyEventsWidget,
//   },
]

interface LbmModalProps extends ModalAndModalButtonSharedProps {
  closeModal: () => void
}

const LbmModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}: LbmModalProps) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={LBM_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => entity.organization}
    mutationDocs={{
      create: CREATE_LBM_ORGANIZATION,
      update: UPDATE_LBM_ORGANIZATION,
      delete: DELETE_LBM_ORGANIZATION,
    }}
    refetchQueries={[
      ...refetchQueries!,
      { query: GET_LBM_ORGANIZATIONS },
      // { query: GET_VIEW_OBM_SERVICES },
      // { query: GET_VIEW_OBM_PAYER_PARTNERSHIPS },
      // { query: GET_VIEW_OBM_INFLUENCERS },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

LbmModal.defaultProps = {
  refetchQueries: [],
  afterMutationHook: () => {},
}

export default LbmModal
