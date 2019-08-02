import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Colors, TransColors } from './../../utils/pulseStyles'
import Tabs from './Tabs'

const defaultTabContainerStyle = {
  padding: '10px 0px',
  margin: '0px 12px',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: -0.3,
  textAlign: 'center'
}

const defaultActiveTabStyle = {
  backgroundColor: Colors.White,
  borderBottom: `2px solid ${ Colors.PulseBlue }`
}

const defaultInactiveTabStyle = {
  backgroundColor: 'transparent',
  color: TransColors.Black30,
  transition: 'color 250ms ease, background-color 250ms ease',
  ':hover': {
    backgroundColor: TransColors.White50,
    color: TransColors.Black30,
    borderBottom: `2px solid ${ TransColors.Black30 }`
  }
}

const UnderlinedTabs = props => {
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
  const combinedActiveTabStyle = _.merge({}, defaultActiveTabStyle, activeTabStyle)
  const combinedInactiveTabStyle = _.merge({}, defaultInactiveTabStyle, inactiveTabStyle)

  return (
    <Tabs
      tabContainerStyle={combinedTabContainerStyle}
      tabsContainerStyle={tabsContainerStyle}
      activeTabStyle={combinedActiveTabStyle}
      inactiveTabStyle={combinedInactiveTabStyle}
      tabsData={tabsData}
      selectedTab={selectedTab}
      onTabClick={onTabClick}
    />
  )
}

UnderlinedTabs.propTypes = {
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

UnderlinedTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  selectedTab: Tabs.defaultProps.selectedTab,
  onTabClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
}

export default UnderlinedTabs
