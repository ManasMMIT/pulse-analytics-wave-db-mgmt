import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import Spacing from '../../../utils/spacing'
import Color from '../../../utils/color'

import Title from '../../Title'
import FieldsSectionCard from '../../FieldsSectionCard'

const SectionsWrapper = styled.div({
  padding: Spacing.S4,
  display: 'flex',
  flexWrap: 'wrap',
})

const sectionStyle = {
  margin: Spacing.S4,
  width: 412,
}

const fieldLabelStyle = {
  color: Color.BLACK,
  fontWeight: 600,
}

const fieldStyle = {
  padding: '12px 0',
}

const BomSections = ({ selectedTab, inputFields, setInputField }) => {
  if (!selectedTab.sections) return null
  const { sections } = selectedTab

  const onEventChange = ({ name, value }) => {
    setInputField(inputs => ({
      ...inputs,
      [name]: value,
    }))
  }

  const onSelectChange = (selected, { name }) => {
    setInputField(inputs => ({
      ...inputs,
      [name]: selected,
    }))
  }

  const hydrateSections = sections.map(section => {
    const fieldsWithProps = section.fields.map(field => {
      const { inputComponent, key, inputProps } = field
      const onChange =
        inputComponent !== 'Select' ? onEventChange : onSelectChange

      const props = {
        ...inputProps,
        onChange,
        value: inputFields[key],
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
      <Title
        titleStyle={{ borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}` }}
        title={'Edit'}
        titleModifiers={[selectedTab.label]}
        size={'FS3'}
      />
      <SectionsWrapper>{fieldSections}</SectionsWrapper>
    </div>
  )
}

BomSections.propTypes = {
  selectedTab: PropTypes.object.isRequired,
  inputFields: PropTypes.object.isRequired,
  setInputField: PropTypes.func.isRequired,
}

export default BomSections
