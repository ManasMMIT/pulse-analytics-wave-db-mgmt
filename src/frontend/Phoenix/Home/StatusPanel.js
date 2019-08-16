import React from 'react'
import styled from '@emotion/styled'
import { Mutation } from 'react-apollo'

import Spinner from '../shared/Spinner'
import { PUSH_SITEMAP } from '../../api/mutations'

const Wrapper = styled.div({
  flex: 1,
  padding: 24,
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
  backgroundColor: '#0a3557',
  display: 'flex',
  justifyContent: 'center',
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
    <Mutation mutation={PUSH_SITEMAP}>
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
  </Wrapper>
)

export default StatusPanel
