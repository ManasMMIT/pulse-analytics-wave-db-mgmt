import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'

import CaptionInputs from './CaptionInputs'
import Spinner from '../../../../../../Phoenix/shared/Spinner'

import {
  GET_SOURCE_INDICATIONS,
} from '../../../../../../api/queries'

import { FormLabel, StyledInput, NewAccessCaptionButton } from '../../../../styledComponents'

const formFieldWrapper = {
  padding: '12px 0',
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
          <FormLabel>
            {label}:
          </FormLabel>
          <StyledInput
            type="text"
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
        <NewAccessCaptionButton
          onClick={() => {
            handleChange({
              target: {
                name: 'caption',
                value: { ...state.input.caption, [nextAvailableSourceIndication]: '' }
              }
            })
          }}
        >
          + Add Caption
        </NewAccessCaptionButton>
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
