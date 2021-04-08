import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import queryString from 'query-string'
// import _ from 'lodash'

import BusinessObjectsPanelItem from './BusinessObjectsPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from '../shared/DeleteButton'

import {
  ListContainer,
  ListHeader,
  ListTitle,
  StyledUnorderedList,
} from '../shared/styledComponents'

import {
  CREATE_BUSINESS_OBJECT,
  UPDATE_BUSINESS_OBJECT,
  DELETE_BUSINESS_OBJECT,
} from '../../../../../api/mutations'

import { GET_BUSINESS_OBJECTS } from '../../../../../api/queries'

const getBusinessObjectsFieldIds = (bo) => {
  const businessObjectId = bo._id

  const firstField = bo.fields[0]

  let fieldIdObj = {}
  if (firstField) {
    fieldIdObj = { fieldId: firstField._id }
  }

  return {
    businessObjectId,
    ...fieldIdObj,
  }
}

const BusinessObjectsPanel = () => {
  const history = useHistory()
  const location = useLocation()

  const selectedBusinessObjectId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).businessObjectId) ||
    ''

  const { data, loading } = useQuery(GET_BUSINESS_OBJECTS)

  const handleClick = (businessObj) => {
    history.push({
      search: queryString.stringify(getBusinessObjectsFieldIds(businessObj)),
    })
  }

  useEffect(() => {
    if (!selectedBusinessObjectId && !loading) {
      const firstBo = data.businessObjects[0]

      handleClick(firstBo)
    }
  }, [loading])

  if (loading) return 'Loading...'

  return (
    <ListContainer style={{ width: '25%' }}>
      <ListHeader>
        <ListTitle>Business Objects</ListTitle>
        <ModalButtonWithForm
          buttonLabel="+"
          mutationDoc={CREATE_BUSINESS_OBJECT}
          afterMutationHook={handleClick}
          modalTitle="Create Business Object"
        />
      </ListHeader>

      <StyledUnorderedList>
        {data.businessObjects.map((businessObject) => (
          <BusinessObjectsPanelItem
            key={businessObject._id}
            isSelected={businessObject._id === selectedBusinessObjectId}
            businessObjectName={businessObject.name}
            handleClick={() => handleClick(businessObject)}
          >
            <ModalButtonWithForm
              buttonLabel="Edit"
              data={businessObject}
              mutationDoc={UPDATE_BUSINESS_OBJECT}
              afterMutationHook={handleClick}
              style={{ fontSize: 10, padding: '4px 8px', marginRight: 8 }}
            />

            <DeleteButton
              mutationVars={{ _id: businessObject._id }}
              mutationDoc={DELETE_BUSINESS_OBJECT}
              afterMutationHook={() => {
                const nextBusinessObjectsSelection = data.businessObjects.find(
                  ({ _id }) => _id !== businessObject._id
                )
                handleClick(nextBusinessObjectsSelection)
              }}
            />
          </BusinessObjectsPanelItem>
        ))}
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default BusinessObjectsPanel
