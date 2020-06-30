import React from 'react'

import {
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
} from 'frontend/api/mutations'

import { GET_PEOPLE, GET_INFLUENCER_TEMPLATE_OBMS } from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

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
    ]}
    afterMutationHook={afterMutationHook}
  />
)

PeopleModal.defaultProps = {
  refetchQueries: [],
}

export default PeopleModal
