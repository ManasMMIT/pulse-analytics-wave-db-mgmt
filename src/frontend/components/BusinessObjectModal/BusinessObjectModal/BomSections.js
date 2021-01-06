import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { transparentize } from 'polished'

import FontSpace from 'frontend/utils/fontspace'
import Spacing from 'frontend/utils/spacing'
import Color from 'frontend/utils/color'

import FieldsSectionCard from '../../FieldsSectionCard'

const SectionsWrapper = styled.div({
  padding: Spacing.S4,
  display: 'flex',
  flexWrap: 'wrap',
  overflowY: 'auto',
})

const sectionStyle = {
  margin: Spacing.S4,
  width: 412,
}

const SectionHeader = styled.div({
  borderBottom: `2px solid ${transparentize(0.9, Color.BLACK)}`,
  padding: Spacing.S4,
})

const SectionTitle = styled.h2({
  ...FontSpace.FS4,
  color: Color.BLACK,
  padding: `0 ${Spacing.S4}`,
})

const fieldLabelStyle = {
  color: Color.BLACK,
  fontWeight: 600,
}

const fieldStyle = {
  padding: '12px 0',
}

const BomSections = ({ selectedTab, boData, setBoData }) => {
  if (!selectedTab.sections) return null
  const { sections } = selectedTab

  const onEventChange = ({ name, value }) => {
    setBoData((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  const onSelectChange = (selected, { name }) => {
    setBoData((inputs) => ({
      ...inputs,
      [name]: selected.value,
    }))
  }

  const onMultiSelectChange = (selected, { name }) => {
    // ! clearing last element makes selected `null`
    if (!selected) selected = []

    setBoData((inputs) => ({
      ...inputs,
      [name]: selected.map(({ value }) => value),
    }))
  }

  const hydrateSections = sections.map((section) => {
    const fieldsWithProps = section.fields.map((field) => {
      const { inputComponent, key, inputProps } = field

      let onChange = onEventChange
      let value = boData[key]
      let clonedInputProps = _.cloneDeep(inputProps)

      if (inputComponent === 'Select') {
        onChange = onSelectChange
        value = { value: boData[key], label: boData[key] }
        clonedInputProps.options = clonedInputProps.options.map((value) => ({
          value,
          label: value,
        }))
      } else if (inputComponent === 'MultiSelect') {
        onChange = onMultiSelectChange
        const selectedValues = (boData[key] || []).map((value) => ({
          value,
          label: value,
        }))

        value = selectedValues
        clonedInputProps.options = clonedInputProps.options.map((value) => ({
          value,
          label: value,
        }))
      }

      const props = {
        ...clonedInputProps,
        onChange,
        value,
        name: key,
      }

      return { ...field, inputProps: props }
    })

    return { ...section, fields: fieldsWithProps }
  })

  const fieldSections = hydrateSections.map(({ _id, label, fields }) => (
    <FieldsSectionCard
      key={`${_id}-${label}`}
      label={label}
      fields={fields}
      containerStyle={sectionStyle}
      fieldLabelStyle={fieldLabelStyle}
      fieldStyle={fieldStyle}
    />
  ))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <SectionHeader>
        <SectionTitle>{selectedTab.label}</SectionTitle>
      </SectionHeader>
      <SectionsWrapper>{fieldSections}</SectionsWrapper>
    </div>
  )
}

BomSections.propTypes = {
  selectedTab: PropTypes.object.isRequired,
  boData: PropTypes.object.isRequired,
  setBoData: PropTypes.func.isRequired,
}

export default BomSections
