import React from 'react'

import {
  CREATE_THERAPEUTIC_AREA,
  UPDATE_THERAPEUTIC_AREA,
  DELETE_THERAPEUTIC_AREA,
} from 'frontend/api/mutations'

import {
  GET_THERAPEUTIC_AREAS,
  GET_SOURCE_INDICATIONS,
} from '../../../api/queries'

import BusinessObjectModal from '../BusinessObjectModal/BusinessObjectModal'

const THERAPEUTIC_AREA_BOID = '5f2ac32600b9d74431f9bc6f'
const HEADER_TEXT = 'Therapeutic Area'

const TherapeuticAreaModal = ({
  closeModal,
  entityId,
  refetchQueries,
  afterMutationHook,
}) => (
  <BusinessObjectModal
    closeModal={closeModal}
    entityId={entityId}
    boId={THERAPEUTIC_AREA_BOID}
    headerText={HEADER_TEXT}
    mutationDocs={{
      create: CREATE_THERAPEUTIC_AREA,
      update: UPDATE_THERAPEUTIC_AREA,
      delete: DELETE_THERAPEUTIC_AREA,
    }}
    refetchQueries={[
      ...refetchQueries,
      { query: GET_THERAPEUTIC_AREAS },
      // if a therapeutic area is deleted, make sure the indications panel's query is updated;
      // otherwise non-existent therapeuticAreaId foreign key may still be cached on that side
      { query: GET_SOURCE_INDICATIONS },
    ]}
    afterMutationHook={afterMutationHook}
  />
)

TherapeuticAreaModal.defaultProps = {
  refetchQueries: [],
}

export default TherapeuticAreaModal
