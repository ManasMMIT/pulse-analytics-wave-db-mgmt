import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { useQuery } from '@apollo/react-hooks'
import Spinner from 'frontend/components/Spinner'

// ! temporary usage of account modal button to emulate style
import { ButtonLabel } from './AccountModals/AccountModalButton/styledAccountModalButtonComponents'

import Color from '../../utils/color'

const StyledButtonLabel = styled(ButtonLabel)({
  background: transparentize(0.85, Color.MEDIUM_GRAY_2),
  color: Color.MEDIUM_GRAY_2,
  fontWeight: 700,
  marginLeft: 12,
  ':hover': {
    background: transparentize(0.75, Color.MEDIUM_GRAY_2),
    color: Color.MEDIUM_GRAY_2,
  },
  ':active': {
    background: transparentize(0.85, Color.GREEN),
    color: Color.GREEN,
  }
})

const getOneOfString = (arr, datumKey) => {
  let result = arr.map(obj => obj[datumKey])
  result = JSON.stringify(result)
  result = result.slice(1, result.length - 1)

  return result
}

const copyToClipboard = oneOfString => {
  navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      navigator.clipboard.writeText(oneOfString)
    } else {
      console.log('permission DENIED')
    }
  })
}

const CopyOneOfStringButton = ({ queryDoc, dataKey, datumKey, buttonStyle }) => {
  const { data, loading, error } = useQuery(queryDoc)

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner />

  const targetData = data[dataKey]

  const oneOfString = getOneOfString(targetData, datumKey)

  return (
    <StyledButtonLabel
      {...Object.assign({}, buttonStyle)}
      onClick={() => copyToClipboard(oneOfString)}
    >
      Copy oneOf string
    </StyledButtonLabel>
  )
}

export default CopyOneOfStringButton
