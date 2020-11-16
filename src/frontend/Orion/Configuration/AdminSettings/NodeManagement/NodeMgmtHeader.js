import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  flex: 0,
  backgroundColor: '#EDF1F5',
  padding: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const span1Style = {
  color: '#0E2539',
  opacity: 0.3,
  fontWeight: 600,
}

const NodeMgmtHeader = () => {
  return (
    <Wrapper>
      <div>
        <span style={span1Style}>EDITING SITEMAP SOURCE NODES</span>
      </div>
    </Wrapper>
  )
}

export default NodeMgmtHeader
