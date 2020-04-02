import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import Spinner from '../../Phoenix/shared/Spinner'

// ! temporary usage of account modal button to emulate style
import { ButtonLabel } from './AccountModals/AccountModalButton/styledAccountModalButtonComponents'

const defaultButtonStyle = {
  background: "#234768",
  color: 'white',
  marginLeft: 12,
}

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
    <ButtonLabel
      {...Object.assign({}, defaultButtonStyle, buttonStyle)}
      onClick={() => copyToClipboard(oneOfString)}
    >
      Copy oneOf string
    </ButtonLabel>
  )
}

export default CopyOneOfStringButton
