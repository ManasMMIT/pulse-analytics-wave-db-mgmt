import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import {
  PUSH_SITEMAP_TO_PROD,
} from '../../../api/mutations'

import Spinner from '../../shared/Spinner'

const buttonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: "#234768",
  color: 'white',
}

const PushToProdButton = () => {
  const [handleSubmit, { loading, error }] = useMutation(PUSH_SITEMAP_TO_PROD)
  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner fill="white" />

  return (
    <div style={{ marginTop: 24 }}>
      <button
        style={buttonStyle}
        onClick={handleSubmit}
      >
        Push Sitemaps to Prod
      </button>
    </div>
  )
}

export default PushToProdButton
