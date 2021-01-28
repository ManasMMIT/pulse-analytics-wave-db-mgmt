import React from 'react'
import PropTypes from 'prop-types'

import { Colors, AlphaColors } from 'Utils/pulseStyles'
import Tabs from './Tabs'

const defaultTabContainerStyle = {
  padding: '14px 24px',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: -0.2,
  textAlign: 'center',
}

const tabBorderRadius = '3px'

const defaultActiveTabStyle = {
  backgroundColor: Colors.White,
  borderRadius: `${tabBorderRadius} ${tabBorderRadius} 0 0`,
}

const defaultInactiveTabStyle = {
  backgroundColor: 'transparent',
  borderRadius: `${tabBorderRadius} ${tabBorderRadius} 0 0`,
  color: AlphaColors.Black30,
  transition: 'color 250ms ease, background-color 250ms ease',
  ':hover': {
    backgroundColor: AlphaColors.White50,
    color: AlphaColors.Blue70,
  },
}

const FilingTabs = (props) => {
  const {
    tabContainerStyle,
    tabsContainerStyle,
    activeTabStyle,
    inactiveTabStyle,
    tabsData,
    selectedTab,
    onTabClick,
  } = props

  const combinedTabContainerStyle = _.merge(
    {},
    defaultTabContainerStyle,
    tabContainerStyle
  )
  const combinedActiveTabStyle = _.merge(
    {},
    defaultActiveTabStyle,
    activeTabStyle
  )
  const combinedInactiveTabStyle = _.merge(
    {},
    defaultInactiveTabStyle,
    inactiveTabStyle
  )

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

FilingTabs.propTypes = {
  tabsData: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node, // can be a React el or anything else that's renderable
      }),
    ])
  ),
  selectedTab: PropTypes.string,
  onTabClick: PropTypes.func,
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object,
  tabsContainerStyle: PropTypes.object,
}

FilingTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  selectedTab: Tabs.defaultProps.selectedTab,
  onTabClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
}

export default FilingTabs
