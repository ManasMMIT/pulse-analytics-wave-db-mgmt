import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import BusinessObjectsPanelItem from './BusinessObjectsPanelItem'
import ModalButtonWithForm from './ModalButtonWithForm'
import DeleteButton from './../shared/DeleteButton'

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
} from '../../../../api/mutations'

import { GET_BUSINESS_OBJECTS } from '../../../../api/queries'

const BusinessObjectsPanel = () => {
  const history = useHistory()
  const {
    businessObjectId: selectedBusinessObjectId,
  } = useParams()

  const { data, loading } = useQuery(GET_BUSINESS_OBJECTS)

  const handleClick = businessObj => {
    // ! need to rip out the old selected businessObj _id param manually
    // ! -- idea here is to rip out that AND whatever field was selected
    const { pathname } = history.location
    const oldPathname = pathname.split('/').slice(0, pathname.split('/').length - 2)

    // ! Now add the newly selected businessObj _id, and let the rerender one level up
    // ! select the first field  for that business obj by default
    const newPathname = [...oldPathname, businessObj._id].join('/')
    
    // ! need the trailing slash so the fieldId can be pushed on and not replace the business obj _id 
    // ! you just added appended
    history.replace(newPathname + '/') 
  }

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
        {
          data.businessObjects.map(businessObject => (
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
                afterMutationHook={() => handleClick(businessObject)}
                style={{ fontSize: 10, padding: '4px 8px', marginRight: 8, }}
              />

              <DeleteButton
                mutationVars={{ _id: businessObject._id }}
                mutationDoc={DELETE_BUSINESS_OBJECT}
                afterMutationHook={() => {
                  const nextBusinessObjectsSelection = data.businessObjects
                    .find(({ _id }) => _id !== businessObject._id)

                  handleClick(nextBusinessObjectsSelection)
                }}
              />
            </BusinessObjectsPanelItem>
          ))
        }
      </StyledUnorderedList>
    </ListContainer>
  )
}

export default BusinessObjectsPanel
