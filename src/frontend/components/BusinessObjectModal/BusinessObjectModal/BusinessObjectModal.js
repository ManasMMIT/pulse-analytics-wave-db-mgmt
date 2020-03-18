import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import useBom from '../../../hooks/useBom'

import { ZIndexes, AlphaColors } from '../../../utils/pulseStyles'
import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import BomSidebar from './BomSidebar'
import FieldCard from '../../../Orion/MasterLists/Tools/Pathways/FieldCard'
import Title from '../../Title'

const ModalWrapper = styled.div({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  background: AlphaColors.Black70,
  zIndex: ZIndexes.Modal,
})

const ModalContent = styled.div({
  background: Color.WHITE,
  borderRadius: Spacing.S2,
  margin: Spacing.S7,
})

const Modal = ({ children }) => (
  <ModalWrapper>
    <ModalContent>{children}</ModalContent>
  </ModalWrapper>
)

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: Spacing.S4,
  borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
})

const BoContent = styled.div({
  display: 'flex',
})

const sidebarStyle = {
  borderRight: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
}

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

  return (
    <Modal>
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
          sidebarStyle={sidebarStyle}
        />
        <div>
          <Title
            title={'Edit'}
            titleModifiers={[selectedTab.label]}
            size={'FS3'}
          />
          {selectedTab.sections &&
            selectedTab.sections.map(section => (
              <FieldCard
                key={section._id}
                sectionData={section}
                inputFields={inputFields}
                setInputField={setInputField}
              />
            ))}
        </div>
      </BoContent>
    </Modal>
  )
}

export default BusinessObjectModal
