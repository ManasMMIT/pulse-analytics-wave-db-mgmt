import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'

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

const formFieldWrapper = { padding: 24 }

const CaptionInputs = ({
  state,
  handleChange,
  availableSourceIndications,
}) => {
  return (
    <div style={formFieldWrapper}>
      <span>captions: </span>
      {
        Object.keys(state.input.caption).map((indication, idx) => {
          const defaultIndication = { value: idx + 100, label: indication }

          return (
            <div
              key={`${indication}-${idx}`}
              style={{ display: 'flex', margin: '12px 0' }}
            >
              <Select
                styles={{ container: (base) => ({ ...base, flex: 1 }) }}
                defaultValue={defaultIndication}
                options={formatIndicationStrings(availableSourceIndications)}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={({ label }) => handleSelectOnChange(label, state, indication, handleChange)}
              />
              <input
                style={{ flex: 7, marginLeft: 25 }}
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
