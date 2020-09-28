import React from 'react'

import {
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
} from 'frontend/api/mutations'

import {
  GET_PEOPLE,
  GET_JOIN_OBMS_AND_PEOPLE,
  GET_VIEW_OBM_INFLUENCERS,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'
import PathwaysInfluencerWidget from './external-data-widgets/PathwaysInfluencerWidget'
import OrganizationConnectionsWidget from './external-data-widgets/OrganizationConnectionsWidget'
import ProviderInfluencerWidget from './external-data-widgets/ProviderInfluencerWidget'
import PhysiciansCompareWidget from './external-data-widgets/PhysiciansCompareWidget'
import OpenPaymentsWidget from './external-data-widgets/OpenPaymentsWidget'
import HistoryWidget from './external-data-widgets/HistoryWidget'

const WIDGETS = [
  {
    _id: 'RELATIONAL_organizationConnectionsWidget',
    label: 'Organization Connections',
    Component: OrganizationConnectionsWidget,
  },
  {
    _id: 'RELATIONAL_pathwaysInfluencerWidget',
    label: 'Pathways Influencers Sheet Data',
    Component: PathwaysInfluencerWidget,
  },
  {
    _id: 'RELATIONAL_providerInfluencerWidget',
    label: 'Provider KDM Sheet Data',
    Component: ProviderInfluencerWidget,
  },
  {
    _id: 'RELATIONAL_physiciansCompareWidget',
    label: 'Physicians Compare',
    Component: PhysiciansCompareWidget,
  },
  {
    _id: 'RELATIONAL_externalSource2Widget',
    label: 'Open Payments',
    Component: OpenPaymentsWidget,
  },
  {
    _id: 'RELATIONAL_historyWidget',
    label: 'History',
    Component: HistoryWidget,
  },
]

const PEOPLE_BOID = '5eea22d5adbf920fa4320487'
const HEADER_TEXT = 'People'

const PeopleModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={PEOPLE_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => `${entity.firstName} ${entity.lastName}`}
    mutationDocs={{
      create: CREATE_PERSON,
      update: UPDATE_PERSON,
      delete: DELETE_PERSON,
    }}
    refetchQueries={[
      ...refetchQueries,
      { query: GET_PEOPLE },
      { query: GET_JOIN_OBMS_AND_PEOPLE },
      { query: GET_VIEW_OBM_INFLUENCERS },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

PeopleModal.defaultProps = {
  refetchQueries: [],
}

export default PeopleModal
