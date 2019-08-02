import React from 'react'
import PropTypes from 'prop-types'

import { Colors, TransColors, Transitions } from 'Utils/pulseStyles'
import Tabs from './Tabs'

const tabBorderRadius = '8px'

const defaultTabContainerStyle = {
  padding: '10px 24px',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: -0.2,
  textAlign: 'center',
  borderRadius: tabBorderRadius,
  flexGrow: 1,
}

const defaultTabsContainerStyle = {
  backgroundColor: TransColors.Blue10,
  borderRadius: tabBorderRadius,
  padding: '4px',
}

const defaultActiveTabStyle = {
  backgroundColor: Colors.White,
}

const defaultInactiveTabStyle = {
  backgroundColor: 'transparent',
  color: TransColors.Black30,
  transition: `color ${ Transitions.Normal }, background-color ${ Transitions.Normal }`,
  ':hover': {
    backgroundColor: TransColors.White50,
    color: TransColors.Blue70
  },
}

const PillTabs = props => {
  const {
    tabContainerStyle,
    tabsContainerStyle,
    activeTabStyle,
    inactiveTabStyle,
    tabsData,
    selectedTab,
    onTabClick,
  } = props

  const combinedTabContainerStyle = _.merge({}, defaultTabContainerStyle, tabContainerStyle)
  const combinedTabsContainerStyle = _.merge({}, defaultTabsContainerStyle, tabsContainerStyle)
  const combinedActiveTabStyle = _.merge({}, defaultActiveTabStyle, activeTabStyle)
  const combinedInactiveTabStyle = _.merge({}, defaultInactiveTabStyle, inactiveTabStyle)

  return (
    <Tabs
      tabContainerStyle={combinedTabContainerStyle}
      tabsContainerStyle={combinedTabsContainerStyle}
      activeTabStyle={combinedActiveTabStyle}
      inactiveTabStyle={combinedInactiveTabStyle}
      tabsData={tabsData}
      selectedTab={selectedTab}
      onTabClick={onTabClick}
    />
  )
}


PillTabs.propTypes = {
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

PillTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  selectedTab: Tabs.defaultProps.selectedTab,
  onTabClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
}

export default PillTabs
