import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

import { customSelectStyles } from '../../../../../../components/customSelectStyles'
import Color from '../../../../../../utils/color'

const formatIndicationStrings = indications => (
  indications.map(({ _id, name }) => ({ value: _id, label: name }))
)

const handleSelectOnChange = (label, state, indication, handleChange) => {
  const newState = _.merge({}, state)
  newState.input.caption[label] = newState.input.caption[indication]
  delete newState.input.caption[indication]

  handleChange({
    target: {
      name: 'caption',
      value: newState.input.caption,
    }
  })
}

const handleAddCaptionField = (e, state, indication, handleChange) => {
  const newState = _.merge({}, state)
  newState.input.caption[indication] = e.target.value

  handleChange({
    target: {
      name: 'caption',
      value: newState.input.caption
    }
  })
}

const formFieldWrapper = { padding: '12px 0' }

const captionItemStyle = {
  margin: '0 0 24px',
  padding: '24px 0',
  borderBottom: `1px solid ${Color.MEDIUM_GRAY_2}`,
}

const inputStyle = {
  background: Color.WHITE,
  padding: '12px 12px',
  borderRadius: 4,
  width: '100%',
  fontSize: 12,
  marginTop: 12,
}

const CaptionInputs = ({
  state,
  handleChange,
  availableSourceIndications,
}) => {
  return (
    <div style={formFieldWrapper}>
      <span style={{ fontSize: 12, color: Color.BLACK, fontWeight: 700 }}>Captions: </span>
      {
        Object.keys(state.input.caption).map((indication, idx) => {
          const defaultIndication = { value: idx + 100, label: indication }

          return (
            <div
              key={`${indication}-${idx}`}
              style={captionItemStyle}
            >
              <Select
                defaultValue={defaultIndication}
                options={formatIndicationStrings(availableSourceIndications)}
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customSelectStyles}
                onChange={({ label }) => handleSelectOnChange(label, state, indication, handleChange)}
              />
              <input
                style={inputStyle}
                type="text"
                name={'caption'}
                onChange={e => handleAddCaptionField(e, state, indication, handleChange)}
                value={state.input.caption[indication] || ''}
              />
            </div>
          )
        })
      }
    </div>
  )
}

CaptionInputs.propTypes = {
  state: PropTypes.object,
  handleChange: PropTypes.func,
  availableSourceIndications: PropTypes.array,
}

export default CaptionInputs
