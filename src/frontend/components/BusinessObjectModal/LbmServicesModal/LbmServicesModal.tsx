import React from 'react'

import {
  CREATE_LBM_SERVICE,
  UPDATE_LBM_SERVICE,
  DELETE_LBM_SERVICE,
} from 'frontend/api/mutations'

import { 
  GET_LBM_SERVICES,
  GET_VIEW_LBM_SERVICES 
} from 'frontend/api/queries'

import LbmServiceCategoryWidget from './relational-widgets/LbmServiceCategoryWidget'
import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

import { ModalAndModalButtonSharedProps } from '../shared/interfaces'

const LBM_SERVICES_BOID = '5fe35a151ba1c4203efe890e'
const HEADER_TEXT = 'LBM Services'

interface LbmServicesModalProps extends ModalAndModalButtonSharedProps {
  closeModal: () => void
}

const WIDGETS = [
  {
    _id: 'RELATIONAL_lbmServiceCategoryWidget',
    label: 'Connect to LBM Service Category',
    Component: LbmServiceCategoryWidget,
  },
]

const LbmServicesModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}: LbmServicesModalProps) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={LBM_SERVICES_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_LBM_SERVICE,
      update: UPDATE_LBM_SERVICE,
      delete: DELETE_LBM_SERVICE,
    }}
    refetchQueries={[
      ...refetchQueries!,
      { query: GET_LBM_SERVICES },
      { query: GET_VIEW_LBM_SERVICES },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

LbmServicesModal.defaultProps = {
  refetchQueries: [],
}

export default LbmServicesModal
