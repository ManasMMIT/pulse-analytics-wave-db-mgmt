import React from 'react'

import {
  CREATE_PATHWAYS_ORGANIZATION,
  UPDATE_PATHWAYS_ORGANIZATION,
  DELETE_PATHWAYS_ORGANIZATION,
} from 'frontend/api/mutations'

import {
  GET_EVENTS,
  GET_JOIN_PATHWAYS_AND_PEOPLE,
  GET_PATHWAYS_ORGANIZATIONS,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'
import InfluencerConnectionsWidget from './relational-widgets/InfluencerConnectionsWidget'
import HistoryWidget from '../shared/widget/HistoryWidget'

const WIDGETS = [
  {
    _id: 'RELATIONAL_pathwaysInfluencerConnectionsWidget',
    label: 'Influencer Connections',
    Component: InfluencerConnectionsWidget,
  },
  {
    _id: 'RELATIONAL_historyWidget',
    label: 'History',
    Component: HistoryWidget,
  },
]

const PATHWAYS_BOID = '5eac3251ac8a01743081f28d'
const HEADER_TEXT = 'Pathways Accounts'

const PathwaysModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={PATHWAYS_BOID}
    headerText={HEADER_TEXT}
    getEntityTitle={(entity) => entity.organization}
    mutationDocs={{
      create: CREATE_PATHWAYS_ORGANIZATION,
      update: UPDATE_PATHWAYS_ORGANIZATION,
      delete: DELETE_PATHWAYS_ORGANIZATION,
    }}
    refetchQueries={[
      ...refetchQueries,
      { query: GET_JOIN_PATHWAYS_AND_PEOPLE },
      { query: GET_PATHWAYS_ORGANIZATIONS },
      { query: GET_EVENTS },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

PathwaysModal.defaultProps = {
  refetchQueries: [],
}

export default PathwaysModal
