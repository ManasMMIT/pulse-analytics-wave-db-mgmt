import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'

import {
  GET_SOURCE_QUALITY_OF_ACCESS_SCORES,
  GET_SOURCE_INDICATIONS,
} from 'frontend/api/queries'

import {
  CREATE_QUALITY_OF_ACCESS_SCORE,
  UPDATE_QUALITY_OF_ACCESS_SCORE,
  // DELETE_QUALITY_OF_ACCESS_SCORE,
} from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import CaptionInputs from './CaptionInputs'
import Spinner from 'frontend/components/Spinner'
import Color from 'frontend/utils/color'
import {
  FormLabel,
  StyledInput,
  NewAccessCaptionButton,
} from '../../../styledComponents'

const formFieldWrapper = {
  padding: '12px 0',
}

const QoaForm = ({ entityId, closeModal }) => {
  const {
    data: { indications },
    loading,
    error,
  } = useQuery(GET_SOURCE_INDICATIONS)
  const { data, loading: scoreLoading } = useQuery(
    GET_SOURCE_QUALITY_OF_ACCESS_SCORES
  )
  const [state, setState] = useState({})

  useEffect(() => {
    if (!_.isEmpty(data)) {
      const entity =
        (qualityOfAccessScores || []).find(({ _id }) => _id === entityId) || {}

      setState(entity)
    }
  }, [data])

  const mutationDoc = entityId
    ? UPDATE_QUALITY_OF_ACCESS_SCORE
    : CREATE_QUALITY_OF_ACCESS_SCORE

  const { __typename, ...rest } = state
  const mutationInput = {
    ...rest,
    caption: state.caption || { General: '' },
  }

  console.log(mutationInput)

  const [save] = useMutation(mutationDoc, {
    variables: {
      input: mutationInput,
    },
    onCompleted: closeModal,
    onError: alert,
    refetchQueries: [{ query: GET_SOURCE_QUALITY_OF_ACCESS_SCORES }],
  })

  if (scoreLoading) return null

  const { qualityOfAccessScores } = data

  const handleChange = (e) => {
    const value =
      e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    setState({ ...state, [e.target.name]: value })
  }

  const simpleInputs = [
    'access',
    'accessTiny',
    'score',
    'sortOrder',
    'color',
  ].map((label, idx) => {
    return (
      <div key={`${label}-${idx}`} style={formFieldWrapper}>
        <FormLabel>{label}:</FormLabel>
        <StyledInput
          type={['score', 'sortOrder'].includes(label) ? 'number' : 'text'}
          name={label}
          onChange={handleChange}
          value={state[label] || null}
        />
      </div>
    )
  })

  let captionInputsContent
  if (error) {
    captionInputsContent = (
      <div style={{ color: 'red' }}>Error processing request</div>
    )
  } else if (loading || scoreLoading) {
    captionInputsContent = <Spinner />
  } else {
    const availableSourceIndications = indications.filter(
      ({ name: sourceName }) => {
        const currentCaptionIndications = Object.keys(mutationInput.caption)

        return !currentCaptionIndications.includes(sourceName)
      }
    )

    const nextAvailableSourceIndication = availableSourceIndications[0].name

    captionInputsContent = (
      <>
        <CaptionInputs
          state={mutationInput}
          handleChange={handleChange}
          availableSourceIndications={availableSourceIndications}
        />
        <NewAccessCaptionButton
          onClick={() => {
            handleChange({
              target: {
                name: 'caption',
                value: {
                  ...mutationInput.caption,
                  [nextAvailableSourceIndication]: '',
                },
              },
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
      <Button
        buttonStyle={{ display: 'block', lineHeight: '36px', fontSize: 14 }}
        color={Color.GREEN}
        type="primary"
        onClick={save}
      >
        submit
      </Button>
    </div>
  )
}

QoaForm.defaultProps = {
  entity: {},
}

export default QoaForm
