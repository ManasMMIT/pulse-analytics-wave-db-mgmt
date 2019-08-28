import React from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import Spinner from '../shared/Spinner'
import { PUSH_SITEMAP_TO_DEV, PUSH_SITEMAP_TO_PROD } from '../../api/mutations'

const Wrapper = styled.div({
  flex: 1,
  padding: 24,
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
  backgroundColor: '#0a3557',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const buttonStyle = {
  border: 'none',
  height: 30,
  borderRadius: 4,
  fontWeight: 700,
  cursor: 'pointer',
  background: "#234768",
  color: 'white',
}


const StatusPanel = () => (
  <Wrapper>
    <div>
      <Mutation mutation={PUSH_SITEMAP_TO_DEV}>
        {(handleSubmit, { loading, error }) => {
          if (error) return <div style={{ color: 'red' }}>Error processing request</div>
          if (loading) return <Spinner fill="white" />

          return (
            <button
              style={buttonStyle}
              onClick={handleSubmit}
            >
              Push Sitemaps to Dev
            </button>
          )
        }}
      </Mutation>
    </div>

    <div style={{ marginTop: 24 }}>
      <Mutation mutation={PUSH_SITEMAP_TO_PROD}>
        {(handleSubmit, { loading, error }) => {
          if (error) return <div style={{ color: 'red' }}>Error processing request</div>
          if (loading) return <Spinner fill="white" />

          return (
            <button
              style={buttonStyle}
              onClick={handleSubmit}
            >
              Push Sitemaps to Prod
            </button>
          )
        }}
      </Mutation>
    </div>
  </Wrapper>
)

export default StatusPanel
