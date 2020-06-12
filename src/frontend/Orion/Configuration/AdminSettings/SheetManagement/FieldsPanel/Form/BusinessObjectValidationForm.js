import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useQuery } from '@apollo/react-hooks'
import {transparentize} from 'polished'

import FontSpace from '../../../../../../utils/fontspace'
import Color from '../../../../../../utils/color'
import {
  FormLabel,
  FieldContainer,
} from './../../shared/styledComponents'

import {
  GET_BUSINESS_OBJECTS,
} from '../../../../../../api/queries'

const BusinessObjectValidationForm = ({
  stagedBusinessObjRef,
  setBusinessObjRef,
}) => {
  // use this to update the possible field options when selected business object changes
  const [businessObjFields, setBusinessObjFields] = useState([])

  const { data, loading } = useQuery(GET_BUSINESS_OBJECTS)

  useEffect(() => {
    // by default, no business obj is selected and stagedBusinessObjRef is null;
    // if that's the case, don't initialize fields options to anything -- leave it empty
    if (!loading && stagedBusinessObjRef) {
      const { businessObjects } = data

      const selectedBo = businessObjects.find(({ _id }) => _id === stagedBusinessObjRef._id)
      const { fields } = selectedBo
      setBusinessObjFields(fields)
    }
  }, [loading])

  const handleBoChange = selectedBo => {
    if (selectedBo) {
      const { value } = selectedBo
      const newSelectedBo = data.businessObjects.find(({ _id }) => _id === value)

      setBusinessObjFields(newSelectedBo.fields)

      setBusinessObjRef({
        _id: value,
        fieldId: newSelectedBo.fields[0]._id,
      })
    } else { // user allowed to clear the bo selection; clearing it clears both dropdowns and checkbox
      setBusinessObjFields([])
      setBusinessObjRef(null)
    }
  }

  const handleBoFieldChange = ({ value }) => {
    const updatedBoRef = Object.assign({}, stagedBusinessObjRef, { fieldId: value })
    setBusinessObjRef(updatedBoRef)
  }

  const handleCheckboxChange = e => {
    const updatedBoRef = Object.assign(
      {}, 
      stagedBusinessObjRef, 
      { allowBlankValues: e.currentTarget.checked },
    )

    setBusinessObjRef(updatedBoRef)
  }

  const formattedBoFields = businessObjFields.map(({ _id, key }) => ({ value: _id, label: key }))

  let formattedBoObjs = []
  let formattedSelectedBo = null
  let formattedSelectedBoField = null
  if (!loading) {
    const { businessObjects } = data
    formattedBoObjs = businessObjects.map(({ _id, name }) => ({ value: _id, label: name }))

    if (stagedBusinessObjRef) {
      const selectedBo = businessObjects.find(({ _id }) => _id === stagedBusinessObjRef._id)
      formattedSelectedBo = { value: selectedBo._id, label: selectedBo.name }

      const selectedBoField = selectedBo.fields.find(({ _id }) => _id === stagedBusinessObjRef.fieldId)
      formattedSelectedBoField = { value: selectedBoField._id, label: selectedBoField.key }
    }
  }

  return (
    <div style={{ borderRadius: 4, background: transparentize(0.4, Color.WHITE), marginBottom: 24, padding: 16 }}>
      <h4 style={{...FontSpace.FS2, textTransform: 'uppercase', fontWeight: 700, color: transparentize(0, Color.BLACK), margin: 0}}>Business Object Restrictions</h4>

      <div style={{ color: transparentize(0.5, Color.BLACK), ...FontSpace.FS2 }}>
        Setting business object restrictions overrides any oneOf restrictions.
      </div>

      {
        loading || (
          <div style={{ marginTop: 24 }}>
            <FieldContainer>
              <FormLabel>Business Object</FormLabel>
              <Select
                styles={{ container: base => ({ ...base, flex: 1 }) }}
                value={formattedSelectedBo}
                onChange={handleBoChange}
                options={formattedBoObjs}
                isClearable
              />
            </FieldContainer>

            <FieldContainer>
              <FormLabel>Field</FormLabel>
              <Select
                styles={{ container: base => ({ ...base, flex: 1 }) }}
                value={formattedSelectedBoField}
                onChange={handleBoFieldChange}
                options={formattedBoFields}
              />
            </FieldContainer>

            <div style={{ display: 'flex' }}>
              <input
                disabled={!Boolean(stagedBusinessObjRef)}
                checked={Boolean(stagedBusinessObjRef && stagedBusinessObjRef.allowBlankValues)}
                type="checkbox"
                onChange={handleCheckboxChange}
                style={{ marginRight: 12, cursor: stagedBusinessObjRef ? 'pointer' : 'not-allowed' }}
              />
              <FormLabel>Allow blank values</FormLabel>
            </div>
          </div>
        )
      }
    </div>
  )
}

BusinessObjectValidationForm.propTypes = {
  stagedBusinessObjRef: PropTypes.object,
  setBusinessObjRef: PropTypes.func,
}

BusinessObjectValidationForm.defaultProps = {
  stagedBusinessObjRef: null,
  setBusinessObjRef: () => {},
}

export default BusinessObjectValidationForm
