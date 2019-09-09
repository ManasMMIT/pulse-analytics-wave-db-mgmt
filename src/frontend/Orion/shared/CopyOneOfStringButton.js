import React from 'react'
import { Query } from 'react-apollo'
import Spinner from '../../Phoenix/shared/Spinner'

const buttonStyle = {
  background: "#234768",
  color: 'white',
  marginLeft: 12,
  cursor: 'pointer',
}

const getOneOfString = arr => {
  let result = arr.map(({ name }) => name)
  result = JSON.stringify(result)
  result = 'oneOf:' + result

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

const CopyOneOfStringButton = ({ queryDoc, dataKey }) => (
  <Query query={queryDoc}>
    {({ data, loading, error }) => {
      if (error) return <div style={{ color: 'red' }}>Error processing request</div>
      if (loading) return <Spinner />

      const targetData = data[dataKey]

      const oneOfString = getOneOfString(targetData)

      return (
        <button
          style={buttonStyle}
          onClick={() => copyToClipboard(oneOfString)}
        >
          Copy oneOf string
        </button>
      )
    }}
  </Query>
)

export default CopyOneOfStringButton
