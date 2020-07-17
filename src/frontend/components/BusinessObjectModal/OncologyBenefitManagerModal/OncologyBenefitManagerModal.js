import React from 'react'

import {
  CREATE_OBM_ORGANIZATION,
  UPDATE_OBM_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_OBM_ORGANIZATIONS,
  GET_VIEW_OBM_SERVICES,
  GET_VIEW_OBM_PAYER_PARTNERSHIPS,
  GET_VIEW_OBM_INFLUENCERS,
} from 'frontend/api/queries'

import ObmServicesWidget from './relational-widgets/ObmServicesWidget'
import ObmInfluencersWidget from './relational-widgets/ObmInfluencersWidget'
import ObmPayersWidget from './relational-widgets/ObmPayersWidget'
import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const OBM_BOID = '5ec81a40b2cfb87bb15373ec'
const HEADER_TEXT = 'Oncology Benefit Manager Accounts'

const WIDGETS = [
  {
    _id: 'RELATIONAL_obmServicesWidget',
    label: 'Connect to OBM Services',
    Component: ObmServicesWidget,
  },
  {
    _id: 'RELATIONAL_obmInfluencersWidget',
    label: 'Connect to OBM Influencers',
    Component: ObmInfluencersWidget,
  },
  {
    _id: 'RELATIONAL_obmPayersWidget',
    label: 'Connect to Payers',
    Component: ObmPayersWidget,
  },
]

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
    getEntityTitle={(entity) => entity.organization}
    mutationDocs={{
      create: CREATE_OBM_ORGANIZATION,
      update: UPDATE_OBM_ORGANIZATION,
    }}
    refetchQueries={[
      ...refetchQueries,
      { query: GET_OBM_ORGANIZATIONS },
      { query: GET_VIEW_OBM_SERVICES },
      { query: GET_VIEW_OBM_PAYER_PARTNERSHIPS },
      { query: GET_VIEW_OBM_INFLUENCERS },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

OncologyBenefitManagerModal.defaultProps = {
  refetchQueries: [],
}

export default OncologyBenefitManagerModal
