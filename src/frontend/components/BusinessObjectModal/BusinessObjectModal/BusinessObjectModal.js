import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'
import gql from 'graphql-tag'

import useBom from '../../../hooks/useBom'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import Title from '../../Title'
import Dialog from '../../Dialog'
import Button from '../../Button'
import Icon from '../../Icon'

const STUB_DOC = gql`
  mutation STUBBED_NO_OP {
    stub
  }
`

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S4,
  borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
})

const BoContent = styled.div({
  display: 'flex',
  overflowY: 'auto',
  height: '100%',
})

const DeleteConfirmationContainer = styled.div({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  padding: 24,
  textAlign: 'center',
})

const DeleteMessageText = styled.p({
  color: Color.BLACK,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.5,
  marginBottom: 12,
})

const DeleteMessageBO = styled.span({
  color: Color.PRIMARY,
  fontWeight: 800,
})

const DeleteMessageCaption = styled.p({
  color: Color.RED,
  fontSize: 12,
  fontWeight: 800,
  lineHeight: 1.5,
  marginTop: 12,
})

const BusinessObjectModal = ({
  entityId,
  boId,
  closeModal,
  headerText,
  getEntityTitle,
  mutationDocs,
  refetchQueries,
  afterMutationHook,
  widgets,
}) => {
  const isEditModal = Boolean(entityId)

  const { schema, entity, loading } = useBom(boId, entityId)

  const [selectedTab, setSelectedTab] = useState({})
  const [inputFields, setInputField] = useState({})
  const [showDeleteConfirmation, toggleDeleteConfirmation] = useState(false)

  const saveMutationToUse = isEditModal ? mutationDocs.update : mutationDocs.create

  const inputToUse = isEditModal ? { _id: entityId, ...inputFields } : inputFields

  console.log('Mutation Input: ', inputToUse)
  const [save] = useMutation(saveMutationToUse, {
    variables: { input: inputToUse },
    refetchQueries,
    onCompleted: (data) => {
      afterMutationHook(data)
      closeModal()
    },
    awaitRefetchQueries: true,
    onError: alert,
  })

  const [deleteHandler] = useMutation(mutationDocs.delete || STUB_DOC, {
    variables: { input: { _id: entityId } },
    refetchQueries,
    onCompleted: (data) => {
      afterMutationHook(data)
      closeModal()
    },
    awaitRefetchQueries: true,
    onError: alert,
  })

  useEffect(() => {
    // ! When useBom errors, it will pass back an empty schema
    if (!loading && !_.isEmpty(schema) && !_.isEmpty(schema.tags)) {
      const firstTab = schema.tags[0]
      const mappedEntitiesToFields = schema.tags.reduce((acc, { sections }) => {
        sections.forEach(({ fields }) => {
          fields.forEach(({ key }) => {
            acc[key] = entity[key] || null
          })
        })
        return acc
      }, {})

      setSelectedTab(firstTab)
      setInputField(mappedEntitiesToFields)
    }
  }, [loading])

  if (loading || _.isEmpty(schema)) return null

  const modalTitle = `${isEditModal ? 'Edit' : 'Create'} ${headerText}`
  const titleModifiers = isEditModal ? [getEntityTitle(entity)] : []

  // Can't allow relationalizing data on create yet; needs to be planned out more
  const allTags = isEditModal ? schema.tags.concat(widgets) : schema.tags
  const sidebarOptions = allTags.map((tag) => ({
    label: tag.label,
    value: tag._id,
  }))

  return (
    <Dialog>
      <Header>
        <Title title={modalTitle} titleModifiers={titleModifiers} />
        <div style={{ margin: `0 ${Spacing.S4}`, display: 'flex', alignItems: 'center' }}>
          {isEditModal && mutationDocs.delete && (
            <Button
              buttonStyle={{ margin: Spacing.S3 }}
              color={Color.RED}
              type="secondary"
              iconName="delete"
              iconColor1={Color.RED}
              onClick={() => toggleDeleteConfirmation(!showDeleteConfirmation)}
            >
              {showDeleteConfirmation ? 'Cancel Delete' : 'Delete'}
            </Button>
          )}
          <Button
            buttonStyle={{ margin: Spacing.S3 }}
            color={Color.GRAY_DARK}
            type="secondary"
            onClick={closeModal}
          >
            Cancel + Close
          </Button>
          <Button buttonStyle={{ margin: Spacing.S3 }} color={Color.GREEN} onClick={save}>
            Save + Close
          </Button>
        </div>
      </Header>

      {showDeleteConfirmation ? (
        <DeleteConfirmationContainer>
          <div>
            <DeleteMessageText>
              Are you sure you want to delete <DeleteMessageBO>{titleModifiers}</DeleteMessageBO>?
            </DeleteMessageText>
            <DeleteMessageText>
              Any connections to <DeleteMessageBO>{titleModifiers}</DeleteMessageBO> will also be
              deleted.
            </DeleteMessageText>
          </div>
          <div style={{ marginTop: 24 }}>
            <Button
              color={Color.RED}
              iconName="delete"
              iconColor1={Color.WHITE}
              onClick={deleteHandler}
            >
              Delete Forever
            </Button>
            <DeleteMessageCaption>This cannot be undone.</DeleteMessageCaption>
          </div>
        </DeleteConfirmationContainer>
      ) : (
        <BoContent>
          <BomSidebar
            options={sidebarOptions}
            onClick={({ value }) => {
              const nextTab = allTags.find(({ _id }) => _id === value)
              setSelectedTab(nextTab)
            }}
            selectedTab={{ value: selectedTab._id, label: selectedTab.label }}
          />

          {selectedTab._id && selectedTab._id.includes('RELATIONAL') ? (
            <selectedTab.Component entity={entity} />
          ) : (
            <BomSections
              isEditModal={isEditModal}
              inputFields={inputFields}
              selectedTab={selectedTab}
              setInputField={setInputField}
            />
          )}
        </BoContent>
      )}
    </Dialog>
  )
}

BusinessObjectModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  boId: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  headerText: PropTypes.string,
  getEntityTitle: PropTypes.func,
  mutationDocs: PropTypes.object,
  refetchQueries: PropTypes.array,
  afterMutationHook: PropTypes.func,
  widgets: PropTypes.array,
}

BusinessObjectModal.defaultProps = {
  closeModal: () => null,
  headerText: '',
  getEntityTitle: (entity) => entity.name,
  mutationDocs: {},
  refetchQueries: [],
  afterMutationHook: () => {},
  widgets: [],
}

export default BusinessObjectModal

// ! thoughts on more dynamic model:
// 1. Upsertion dynamic mutation
// 2. Deletion dynamic mutation
// const [save] = useMutation(SUPER_DYNAMIC_ENDPOINT_EITHER_DELETE_OR_UPSERT, // make a dynamic modal mutation
//   {
//     variables: {
//       input: {
//         boId,// get to correct collection
//         entityId, // search to upsert
//         inputFields // set obj
//       },
//     },
//     update: (cache, { data }) => {
//       const { __typename, ...newOrUpdatedEntity } = data[Object.keys(data)[0]]

//       const cacheId = `${__typename}:${newOrUpdatedEntity._id}`

//       cache.writeFragment({
//         // id: 'PathwaysOrganization:5d825338cc80b15a9476ba84', // ! example format
//         id: cacheId,
//         fragment: gql`
//           fragment ${ __typename + _.uniqueId() } on ${ __typename } {
//             ${ Object.keys(newOrUpdatedEntity).join('\n') }
//             __typename
//           }
//         `,
//         data: {
//           ...newOrUpdatedEntity,
//           __typename,
//         },
//       });
//     }
//     // refetchQueries: [{ query: MAP_QUERY_THINGY[boId] }]
//   })
