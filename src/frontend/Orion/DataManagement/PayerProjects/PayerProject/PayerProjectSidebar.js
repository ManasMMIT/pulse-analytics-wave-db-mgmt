import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'

import Sidebar from '../../../../components/Sidebar'
import SidebarItem from '../../../../components/Sidebar/SidebarItem'

import Color from '../../../../utils/color'

import { GET_SINGLE_PAYER_PROJECT } from '../../../../api/queries'
import Spinner from '../../../../Phoenix/shared/Spinner'

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

  const { data, loading } = useQuery(
    GET_SINGLE_PAYER_PROJECT,
    { variables: { projectId: match.params.projectId }}
  )

  const payerProjectName = loading
    ? <Spinner />
    : data.singlePayerProject.name

  return (
    <Sidebar sidebarStyle={{ borderRight: `1px solid ${ Color.LIGHT_GRAY_1 }`}}>
      <h3>{ payerProjectName }</h3>
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