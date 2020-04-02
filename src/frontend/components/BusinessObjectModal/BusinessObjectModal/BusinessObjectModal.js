import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import useBom from '../../../hooks/useBom'

import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import Title from '../../Title'
import Dialog from '../../Dialog'

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

const BusinessObjectModal = ({ entityId, boId, closeModal, headerText }) => {
  const { schema, entity, loading } = useBom(boId, entityId)

  const [selectedTab, setSelectedTab] = useState({})
  const [inputFields, setInputField] = useState({})

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
  }, [loading, schema.tags, entity])

  if (loading) return null

  const modalTitle = `Edit ${headerText}`
  const modalTitleModifier = [entity.organization]
  console.log(inputFields)

  return (
    <Dialog>
      <Header>
        <Title title={modalTitle} titleModifiers={modalTitleModifier} />
        <div style={{ margin: Spacing.S4 }}>
          <button onClick={closeModal}>Cancel + Close</button>
          <button onClick={closeModal}>Save + Close</button>
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
}

BusinessObjectModal.defaultProps = {
  closeModal: () => null,
  headerText: '',
}

export default BusinessObjectModal
