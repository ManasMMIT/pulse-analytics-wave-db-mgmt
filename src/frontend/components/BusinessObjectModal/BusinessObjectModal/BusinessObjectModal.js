import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { transparentize } from 'polished'

import useBom from '../../../hooks/useBom'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import STUB_DOC from 'frontend/api/utils/stub-doc'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import ButtonGroup from './ButtonGroup'
import DeleteConfirmation from './DeleteConfirmation'
import Dialog from '../../Dialog'

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: Spacing.S4,
  borderBottom: `2px solid ${transparentize(0.9, Color.BLACK)}`,
  position: 'relative',
})

const ModalTitleContainer = styled.div({
  padding: `0 ${Spacing.S4}`,
})

const ModalTitle = styled.h1({
  ...FontSpace.FS5,
  color: Color.BLACK,
})

const ModalSubtitle = styled.h4({
  ...FontSpace.FS2,
  color: Color.GRAY_DARK,
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
  const [currentEntityId, setCurrentEntityId] = useState(entityId)
  const isEditModal = Boolean(currentEntityId)

  const { schema, entity, loading } = useBom(boId, currentEntityId)

  const [selectedTab, setSelectedTab] = useState({})
  const [boData, setBoData] = useState({})
  const [showDeleteConfirmation, toggleDeleteConfirmation] = useState(false)

  const [deleteHandler] = useMutation(mutationDocs.delete || STUB_DOC, {
    variables: { input: { _id: currentEntityId } },
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
            acc[key] = [undefined, '', NaN].includes(entity[key])
              ? null
              : entity[key]
          })
        })
        return acc
      }, {})

      setSelectedTab(firstTab)
      setBoData(mappedEntitiesToFields)
    }
  }, [loading])

  if (loading || _.isEmpty(schema)) return null

  const modalTitle = isEditModal ? getEntityTitle(entity) : null
  const modalSubtitle = headerText

  // Can't allow relationalizing data on create yet; needs to be planned out more
  const allTags = isEditModal ? schema.tags.concat(widgets) : schema.tags
  const sidebarOptions = allTags.map((tag) => ({
    label: tag.label,
    value: tag._id,
  }))

  return (
    <Dialog>
      <Header id="BoModalHeader">
        <ModalTitleContainer>
          <ModalTitle>{modalTitle}</ModalTitle>
          <ModalSubtitle>{modalSubtitle}</ModalSubtitle>
        </ModalTitleContainer>
        <ButtonGroup
          setBoData={setBoData}
          mutationDocs={mutationDocs}
          toggleDeleteConfirmation={toggleDeleteConfirmation}
          showDeleteConfirmation={showDeleteConfirmation}
          closeModal={closeModal}
          boData={boData}
          entityId={currentEntityId}
          refetchQueries={refetchQueries}
          afterMutationHook={afterMutationHook}
          isEditModal={isEditModal}
          setCurrentEntityId={setCurrentEntityId}
        />
      </Header>
      <DeleteConfirmation
        showDeleteConfirmation={showDeleteConfirmation}
        entityText={modalTitle}
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
              boData={boData}
              selectedTab={selectedTab}
              setBoData={setBoData}
            />
          )}
        </BoContent>
      )}
    </Dialog>
  )
}

BusinessObjectModal.propTypes = {
  entityId: PropTypes.string, // could be null when creating an instance of a bo
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
  afterMutationHook: () => { },
  widgets: [],
}

export default BusinessObjectModal
