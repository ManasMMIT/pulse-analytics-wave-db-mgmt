import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons"

import CaptionInputs from './CaptionInputs'
import Spinner from '../../../../../../Phoenix/shared/Spinner'

import {
  GET_SOURCE_INDICATIONS,
} from '../../../../../../api/queries'

const plusIcon = (
  <FontAwesomeIcon
    size="lg"
    icon={faPlusSquare}
    style={{ margin: '15px 0', display: 'inline' }}
  />
)

const formFieldWrapper = {
  padding: '24px 0',
  display: 'flex',
  alignItems: 'center',
}

const labelStyle = {
  padding: 24,
  minWidth: 100,
}

const inputStyle = {
  flex: 1,
  padding: '12px 24px',
  boxSizing: 'border-box',
  margin: '8px 0',
}

const QoaForm = ({
  state,
  handleChange,
}) => {
  state.input.caption = state.input.caption || { 'General': '' }

  const simpleInputs = ['access', 'accessTiny', 'score', 'sortOrder', 'color']
    .map((label, idx) => {
      return (
        <div
          key={`${label}-${idx}`}
          style={formFieldWrapper}
        >
          <span style={labelStyle}>
            {label}:
          </span>
          <input
            type="text"
            style={inputStyle}
            name={label}
            onChange={handleChange}
            value={state.input[label] || ''}
          />
        </div>
      )
    })

  const { data: { indications }, loading, error } = useQuery(GET_SOURCE_INDICATIONS)

  let captionInputsContent
  if (error) {
    captionInputsContent = <div style={{ color: 'red' }}>Error processing request</div>
  } else if (loading) {
    captionInputsContent = <Spinner />
  } else {
    const availableSourceIndications = indications.filter(({ name: sourceName }) => {
      const currentCaptionIndications = Object.keys(state.input.caption)

      return !currentCaptionIndications.includes(sourceName)
    })

    const nextAvailableSourceIndication = availableSourceIndications[0].name

    captionInputsContent = (
      <>
        <CaptionInputs
          state={state}
          handleChange={handleChange}
          availableSourceIndications={availableSourceIndications}
        />
        <div
          onClick={() => {
            handleChange({
              target: {
                name: 'caption',
                value: { ...state.input.caption, [nextAvailableSourceIndication]: '' }
              }
            })
          }}
        >
          {plusIcon}
        </div>
      </>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
      }}
    >
      {simpleInputs}
      {captionInputsContent}
    </div>
  )
}

QoaForm.propTypes = {
  state: PropTypes.object,
  handleChange: PropTypes.func,
}

export default QoaForm
