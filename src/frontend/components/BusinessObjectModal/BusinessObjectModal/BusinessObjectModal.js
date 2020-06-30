import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'
import gql from 'graphql-tag'

import useBom from '../../../hooks/useBom'

import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import Title from '../../Title'
import Dialog from '../../Dialog'
import Button from '../../Button'
import { Colors } from '../../../utils/pulseStyles'

const STUB_DOC = gql`
  mutation STUBBED_NO_OP {
    stub
  }
`

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: Spacing.S4,
  borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
})

const BoContent = styled.div({
  display: 'flex',
  overflowY: 'auto',
  height: '100%',
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

  const saveMutationToUse = isEditModal
    ? mutationDocs.update
    : mutationDocs.create

  const inputToUse = isEditModal
    ? { _id: entityId, ...inputFields }
    : inputFields

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
  const titleModifiers = [getEntityTitle(entity)]

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
        <div style={{ margin: Spacing.S4 }}>
          <Button
            buttonStyle={{ margin: Spacing.S4 }}
            color={Colors.MEDIUM_GRAY_2}
            onClick={closeModal}
          >
            Cancel + Close
          </Button>
          {isEditModal && mutationDocs.delete && (
            <Button
              buttonStyle={{ margin: Spacing.S4 }}
              color={Colors.RED}
              onClick={() => toggleDeleteConfirmation(!showDeleteConfirmation)}
            >
              {showDeleteConfirmation ? 'Cancel Delete' : 'Delete'}
            </Button>
          )}
          <Button
            buttonStyle={{ margin: Spacing.S4 }}
            color={Colors.GREEN}
            onClick={save}
          >
            Save + Close
          </Button>
        </div>
      </Header>

      {showDeleteConfirmation ? (
        <div style={{ padding: 24, margin: '0 auto' }}>
          <p>Are you sure you want to delete?</p>
          <p>Any connections to this business object will also be deleted.</p>
          <Button
            buttonStyle={{ margin: 24 }}
            color={Colors.RED}
            onClick={deleteHandler}
          >
            Delete Forever
          </Button>
        </div>
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
  getEntityTitle: (entity) => (entity ? entity.name : ''),
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
