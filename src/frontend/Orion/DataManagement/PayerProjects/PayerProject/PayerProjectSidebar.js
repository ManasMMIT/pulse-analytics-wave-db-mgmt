import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'

import Sidebar from '../../../../components/Sidebar'
import SidebarItem from '../../../../components/Sidebar/SidebarItem'

const generateSidebarItems = (
  selectedSidebarItem,
  url
) => ({ label, link }) => {
  const isSelected = selectedSidebarItem === link
  const option = { label }

  return (
    <NavLink
      key={label}
      to={`${ url }/${ link }`}
    >
      <SidebarItem
        isSelected={isSelected}
        option={option}
      />
    </NavLink>
  )
}

const PayerProjectSidebar = ({
  sidebarConfig,
  match,
  location,
}) => {
  const { url } = match
  const { pathname } = location
  const selectedSidebarItem = pathname.split('/').pop()

  return (
    <Sidebar>
      { sidebarConfig.map(generateSidebarItems(selectedSidebarItem, url)) }
    </Sidebar>
  )
}

PayerProjectSidebar.propTypes = {
  sidebarConfig: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    })
  ),
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default PayerProjectSidebar