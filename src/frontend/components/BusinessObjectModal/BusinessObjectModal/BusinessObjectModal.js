import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import gql from 'graphql-tag'

import useBom from '../../../hooks/useBom'

import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import Title from '../../Title'
import Dialog from '../../Dialog'
import Button from '../../Button'
import { Colors } from '../../../utils/pulseStyles'

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

const formatSchemaItems = schema => {
  return schema.tags.map(tag => ({ label: tag.label, value: tag._id }))
}

const isOptionsInput = input => (
  _.isObject(input)
  && Object.keys(input).length === 2
  && input.label
  && input.value
)

const getInputValues = inputFields => {
  const cloneIdInputFields = _.cloneDeep(inputFields)

  Object.entries(inputFields).forEach(([key, value]) => {
    if (isOptionsInput(value)) {
      cloneIdInputFields[key] = value.value
    }
  })

  return cloneIdInputFields
}

const BusinessObjectModal = ({
  entityId,
  boId,
  closeModal,
  headerText,
  mutationDocs,
  refetchQueries,
  afterMutationHook,
}) => {
  const { schema, entity, loading } = useBom(boId, entityId)

  const [selectedTab, setSelectedTab] = useState({})
  const [inputFields, setInputField] = useState({})

  const mutationToUse = entityId
    ? mutationDocs.update
    : mutationDocs.create

  const inputToUse = entityId
    ? { _id: entityId, ...inputFields }
    : inputFields

  // todo: only clean input onClick
  const input = getInputValues(inputToUse)

  const [save] = useMutation(
    mutationToUse,
    {
      variables: { input },
      refetchQueries,
      onCompleted: () => {
        afterMutationHook()
        closeModal()
      },
      awaitRefetchQueries: true,
      onError: alert,
    }
  )

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

  useEffect(() => {
    if (!loading) {
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

  if (loading) return null

  const modalTitle = `${entityId ? 'Edit' : 'Create'} ${headerText}`
  const modalTitleModifier = [entity.organization]
  console.log(inputFields)

  return (
    <Dialog>
      <Header>
        <Title title={modalTitle} titleModifiers={modalTitleModifier} />
        <div style={{ margin: Spacing.S4 }}>
          <Button
            buttonStyle={{ margin: Spacing.S4 }}
            color={Colors.MEDIUM_GRAY_2}
            onClick={closeModal}
          >
            Cancel + Close
          </Button>
          <Button
            buttonStyle={{ margin: Spacing.S4 }}
            color={Colors.GREEN}
            onClick={save}
          >
            Save + Close
          </Button>
        </div>
      </Header>
      <BoContent>
        <BomSidebar
          options={formatSchemaItems(schema)}
          onClick={({ value }) => {
            const nextTab = schema.tags.find(({ _id }) => _id === value)
            setSelectedTab(nextTab)
          }}
          selectedTab={{ value: selectedTab._id, label: selectedTab.label }}
        />
        <BomSections
          inputFields={inputFields}
          selectedTab={selectedTab}
          setInputField={setInputField}
        />
      </BoContent>
    </Dialog>
  )
}

BusinessObjectModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  boId: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  headerText: PropTypes.string,
  mutationDocs: PropTypes.object,
  refetchQueries: PropTypes.array,
  afterMutationHook: PropTypes.func,
}

BusinessObjectModal.defaultProps = {
  closeModal: () => null,
  headerText: '',
  mutationDocs: {},
  refetchQueries: [],
  afterMutationHook: () => {},
}

export default BusinessObjectModal
