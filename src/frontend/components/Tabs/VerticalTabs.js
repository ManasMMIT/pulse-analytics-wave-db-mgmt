import React from 'react'
import PropTypes from 'prop-types'

import Tabs from './Tabs'

const VerticalTabs = props => {
  const {
    tabContainerStyle,
    tabsContainerStyle,
    activeTabStyle,
    inactiveTabStyle,
    tabsData,
    selectedTab,
    onTabClick,
  } = props

  const combinedTabsContainerStyle = Object.assign(
    { flexDirection: 'column' }, tabsContainerStyle
  )

  return (
    <Tabs
      tabContainerStyle={tabContainerStyle}
      tabsContainerStyle={combinedTabsContainerStyle}
      activeTabStyle={activeTabStyle}
      inactiveTabStyle={inactiveTabStyle}
      tabsData={tabsData}
      selectedTab={selectedTab}
      onTabClick={onTabClick}
    />
  )
}

VerticalTabs.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node // can be a React el or anything else that's renderable
      })
    ])
  ),
  selectedTab: PropTypes.string,
  onTabClick: PropTypes.func,
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object,
  tabsContainerStyle: PropTypes.object,
}

VerticalTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  selectedTab: Tabs.defaultProps.selectedTab,
  onTabClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
}

export default VerticalTabs
