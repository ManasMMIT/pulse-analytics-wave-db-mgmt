import React from 'react'

import {
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
} from 'frontend/api/mutations'

import {
  GET_PEOPLE,
  GET_INFLUENCER_TEMPLATE_OBMS,
  GET_OBM_AND_PERSON_CONNECTIONS,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'
import PathwaysInfluencerWidget from './external-data-widgets/PathwaysInfluencerWidget'
import ProviderInfluencerWidget from './external-data-widgets/ProviderInfluencerWidget'
import PhysiciansCompareWidget from './external-data-widgets/PhysiciansCompareWidget'
import OpenPaymentsWidget from './external-data-widgets/OpenPaymentsWidget'

const WIDGETS = [
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
      { query: GET_INFLUENCER_TEMPLATE_OBMS },
      { query: GET_OBM_AND_PERSON_CONNECTIONS },
    ]}
    afterMutationHook={afterMutationHook}
    widgets={WIDGETS}
  />
)

PeopleModal.defaultProps = {
  refetchQueries: [],
}

export default PeopleModal
