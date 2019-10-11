import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import Spinner from '../../shared/Spinner'
import {
  PUSH_SITEMAP_TO_DEV,
} from '../../../api/mutations'

const buttonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: "#234768",
  color: 'white',
}

const PushToDevButton = () => {
  const [handleSubmit, { loading, error }] = useMutation(PUSH_SITEMAP_TO_DEV)
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner fill="white" />

  return (
    <div>
      <button
        style={buttonStyle}
        onClick={handleSubmit}
      >
        Push Sitemaps to Dev
      </button>
    </div>
  )
}
export default PushToDevButton
