import React from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'

import Tab from './Tab'

class Tabs extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.selectedTab !== nextProps.selectedTab
  }

  handleClick(selectedTab) {
    this.props.onTabClick(selectedTab)
  }

  render() {
    const {
      tabsData,
      selectedTab,
      onTabClick,
      activeTabStyle,
      inactiveTabStyle,
      tabContainerStyle,
      tabsContainerStyle,
    } = this.props

    const combinedTabsContainerStyle = Object.assign({}, { display: 'flex' }, tabsContainerStyle)

    return (
      <div {...css(combinedTabsContainerStyle)}>
        {
          tabsData.map(tabDatum => {
            const tabValue = typeof tabDatum === 'string' ? tabDatum : tabDatum.value

            return (
              <Tab
                key={tabValue}
                tabContent={tabDatum}
                handleClick={onTabClick}
                selectedTab={selectedTab}
                activeTabStyle={activeTabStyle}
                inactiveTabStyle={inactiveTabStyle}
                tabContainerStyle={tabContainerStyle}
              />
            )
          })
        }
      </div>
    )
  }
}

Tabs.propTypes = {
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

Tabs.defaultProps = {
  tabsData: [Tab.defaultProps.tabContent],
  selectedTab: Tab.defaultProps.selectedTab,
  onTabClick: () => {},
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
}

export default Tabs
