import React from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'

import Panel from './Panel'

const Wrapper = styled.div(
  {
    display: 'flex',
    width: '100%',
    height: '100vh',
  },
  ({ style }) => ({
    ...style,
  })
)

const PanelDashboard = ({ panels, ListItem, style }) => {
  const searchParamsAncestry = []

  //should this be a util?
  panels = panels.map((panel) => {
    searchParamsAncestry.push(panel.searchParam)
    panel.searchParamsAncestry = searchParamsAncestry.slice()
    return panel
  })

  return (
    <Wrapper style={style}>
      {panels.map((panel) => (
        <Panel key={panel.title.label} ListItem={ListItem} {...panel} />
      ))}
    </Wrapper>
  )
}

PanelDashboard.propTypes = {
  panels: PropTypes.array.isRequired,
  style: PropTypes.object,
}

PanelDashboard.defaultProps = {
  style: {},
}

export default PanelDashboard
