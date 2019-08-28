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
    defaultSelectedTab,
    useStateProps,
    children,
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
      useStateProps={useStateProps}
      defaultSelectedTab={defaultSelectedTab}
    >
      {children}
    </Tabs>
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
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object,
  tabsContainerStyle: PropTypes.object,
  defaultSelectedTab: Tabs.propTypes.defaultSelectedTab,
  useStateProps: Tabs.propTypes.useStateProps,
}

VerticalTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
  defaultSelectedTab: Tabs.defaultProps.defaultSelectedTab,
  useStateProps: Tabs.defaultProps.useStateProps,
}

export default VerticalTabs
