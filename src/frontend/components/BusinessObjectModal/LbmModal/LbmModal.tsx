import React from 'react'

import {
  CREATE_LBM_ORGANIZATION,
  UPDATE_LBM_ORGANIZATION,
  DELETE_LBM_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_LBM_ORGANIZATIONS,
  GET_VIEW_LBM_SERVICES,
  GET_VIEW_LBM_PAYER_PARTNERSHIPS,
  GET_VIEW_LBM_INFLUENCERS,
} from 'frontend/api/queries'

import LbmInfluencersWidget from './relational-widgets/LbmInfluencersWidget'
import LbmServicesWidget from './relational-widgets/LbmServicesWidget'
import LbmPayersWidget from './relational-widgets/LbmPayersWidget'
import LbmTypesWidget from './relational-widgets/LbmTypesWidget'
import LbmKeyEventsWidget from './relational-widgets/LbmKeyEventsWidget'
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
  {
    _id: 'RELATIONAL_lbmServicesWidget',
    label: 'Connect to LBM Services',
    Component: LbmServicesWidget,
  },
  {
    _id: 'RELATIONAL_lbmInfluencersWidget',
    label: 'Connect to LBM Influencers',
    Component: LbmInfluencersWidget,
  },
  {
    _id: 'RELATIONAL_lbmPayersWidget',
    label: 'Connect to Payers',
    Component: LbmPayersWidget,
  },
  {
    _id: 'RELATIONAL_lbmKeyEvents',
    label: 'Manage Key Events',
    Component: LbmKeyEventsWidget,
  },
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
      { query: GET_VIEW_LBM_SERVICES },
      { query: GET_VIEW_LBM_PAYER_PARTNERSHIPS },
      { query: GET_VIEW_LBM_INFLUENCERS },
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
