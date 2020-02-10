import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Colors, AlphaColors } from './../../utils/pulseStyles'
import Tabs from './Tabs'

const defaultTabContainerStyle = {
  padding: '10px 0px',
  margin: '0px 12px',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: -0.3,
  textAlign: 'center',
}

const defaultActiveTabStyle = {
  backgroundColor: 'transparent',
  borderBottom: `2px solid ${Colors.PRIMARY}`,
}

const defaultInactiveTabStyle = {
  backgroundColor: 'transparent',
  borderBottom: '2px solid transparent',
  color: AlphaColors.Black30,
  transition: 'color 250ms ease, background-color 250ms ease',
  ':hover': {
    color: AlphaColors.Black50,
    borderBottom: `2px solid ${AlphaColors.Black50}`,
  }
}

const UnderlinedTabs = props => {
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
      useStateProps={useStateProps}
      defaultSelectedTab={defaultSelectedTab}
    >
      {children}
    </Tabs>
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
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object,
  tabsContainerStyle: PropTypes.object,
  defaultSelectedTab: Tabs.propTypes.defaultSelectedTab,
  useStateProps: Tabs.propTypes.useStateProps,
}

UnderlinedTabs.defaultProps = {
  tabsData: Tabs.defaultProps.tabsData,
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
  defaultSelectedTab: Tabs.defaultProps.defaultSelectedTab,
  useStateProps: Tabs.defaultProps.useStateProps,
}

export default UnderlinedTabs
