import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'

import useBom from '../../../hooks/useBom'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import STUB_DOC from 'frontend/api/utils/stub-doc'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import ButtonGroup from './ButtonGroup'
import DeleteConfirmation from './DeleteConfirmation'
import Title from '../../Title'
import Dialog from '../../Dialog'

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
        <ButtonGroup
          mutationDocs={mutationDocs}
          toggleDeleteConfirmation={toggleDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
          closeModal={closeModal}
          inputFields={inputFields}
          entityId={entityId}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
        />
      </Header>
      <DeleteConfirmation
        showDeleteConfirmation={showDeleteConfirmation}
        titleModifiers={titleModifiers}
        deleteHandler={deleteHandler}
      />
      {!showDeleteConfirmation && (
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
