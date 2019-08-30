import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { css } from 'glamor'
import _ from 'lodash'

import Tab from './Tab'

const areUseStatePropsValid = useStateProps => (
  Array.isArray(useStateProps)
    && useStateProps.length === 2
    && (_.isString(useStateProps[0]) || _.isObject(useStateProps[0]))
    && _.isFunction(useStateProps[1])
)

const Tabs = props => {
  const {
    tabsData,
    activeTabStyle,
    inactiveTabStyle,
    tabContainerStyle,
    tabsContainerStyle,
    defaultSelectedTab,
    useStateProps,
    children,
  } = props

  let [selectedTab, onTabClick] = useState(defaultSelectedTab || tabsData[0])

  if (areUseStatePropsValid(useStateProps)) {
    [selectedTab, onTabClick] = useStateProps
  }

  const selectedValue = _.isObject(selectedTab)
    ? selectedTab.value
    : selectedTab

  const selectedIdx = tabsData.findIndex(tab => {
    const tabValue = _.isObject(tab)
      ? tab.value
      : tab

    return tabValue === selectedValue
  })

  const combinedTabsContainerStyle = Object.assign({}, { display: 'flex' }, tabsContainerStyle)

  return (
    <>
      <div {...css(combinedTabsContainerStyle)}>
        {
          tabsData.map(tabDatum => {
            const tabValue = typeof tabDatum === 'string'
              ? tabDatum
              : tabDatum.value

            return (
              <Tab
                key={tabValue}
                tabContent={tabDatum}
                handleClick={value => onTabClick(value)}
                selectedTab={selectedTab}
                activeTabStyle={activeTabStyle}
                inactiveTabStyle={inactiveTabStyle}
                tabContainerStyle={tabContainerStyle}
              />
            )
          })
        }
      </div>

      {
        Array.isArray(children)
          ? children[selectedIdx]
          : children
      }
    </>
  )
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
  activeTabStyle: PropTypes.object,
  inactiveTabStyle: PropTypes.object,
  tabContainerStyle: PropTypes.object,
  tabsContainerStyle: PropTypes.object,
  defaultSelectedTab: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.node // can be a React el or anything else that's renderable
    })
  ]),
  useStateProps: PropTypes.array, // needs to follow useState format
}

Tabs.defaultProps = {
  tabsData: [Tab.defaultProps.tabContent],
  activeTabStyle: {},
  inactiveTabStyle: {},
  tabContainerStyle: {},
  tabsContainerStyle: {},
  defaultSelectedTab: null,
  useStateProps: null,
}

export default Tabs
