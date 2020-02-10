import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import { Colors } from '../../utils/pulseStyles'

const tabContainerCallback = ({
  isSelected,
  activeStyle,
  inactiveStyle
}) => (isSelected ? activeStyle : inactiveStyle)

const Tab = ({
  tabContent,
  selectedTab,
  handleClick,
  activeTabStyle,
  inactiveTabStyle,
  tabContainerStyle
}) => {
  const isTabContentString = typeof tabContent === 'string'

  const isSelected = isTabContentString
    ? selectedTab === tabContent
    : selectedTab === tabContent.value

  const content = isTabContentString ? tabContent : tabContent.label

  const activeStyle = { cursor: 'default', color: Colors.PulseBlue, ...activeTabStyle }
  const inactiveStyle = { cursor: 'pointer', ...inactiveTabStyle }
  
  const TabContainer = styled.span(tabContainerStyle, tabContainerCallback)

  return (
    <TabContainer
      isSelected={isSelected}
      activeStyle={activeStyle}
      inactiveStyle={inactiveStyle}
      onClick={() => handleClick(tabContent.value || tabContent)}
      style={tabContainerStyle}
    >
      { content }
    </TabContainer>
  )
}

Tab.propTypes = {
  tabContent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.node // can be a React el or anything else that's renderable
    })
  ]),
  selectedTab: PropTypes.string,
  handleClick: PropTypes.func,
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object
}

Tab.defaultProps = {
  tabContent: '--',
  selectedTab: 'selectedTab',
  handleClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {}
}

export default Tab
