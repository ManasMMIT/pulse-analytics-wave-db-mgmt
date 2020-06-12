import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { transparentize } from 'polished'

import Sidebar from 'frontend/components/Sidebar'
import SidebarItem from 'frontend/components/Sidebar/SidebarItem'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'
import { AlphaColors } from 'frontend/utils/pulseStyles'
import Icon from 'frontend/components/Icon'

const SidebarWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${ AlphaColors.Black10 }`,
})

const HeaderWrapper = styled.div({
  padding: `${ Spacing.S4 } ${ Spacing.S7 }`,
  borderBottom: `1px solid ${ AlphaColors.Black10 }`
})

const HeaderLabel = styled.h3({
  ...FontSpace.FS1,
  color: AlphaColors.Black30,
  textTransform: 'uppercase'
})

const Header = styled.h3({
  ...FontSpace.FS2,
  fontWeight: 700,
  color: Color.PRIMARY
})

const NavWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  padding: Spacing.S4,
  borderBottom: `1px solid ${ AlphaColors.Black10 }`
})

const BackNavLabel = styled.h1({
  color: AlphaColors.Black30,
  fontWeight: 700,
  textTransform: 'uppercase',
  ...FontSpace.FS1,
  ':hover': {
    color: Color.BLUE,
    background: transparentize(0.9, Color.BLUE)
  }
})

const sidebarItemStyle = {
  ':hover': {
    background: transparentize(0.9, Color.BLACK),
    color: Color.BLACK,
  }
}

const generateSidebarItems = ({
  selectedSidebarItem,
  url,
}) => ({ label, link }) => {
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
        itemStyle={sidebarItemStyle}
      />
    </NavLink>
  )
}

const PayerProjectSidebar = ({
  sidebarConfig,
  match,
  location,
  projectName
}) => {
  const { url } = match
  const { pathname } = location
  const selectedSidebarItem = pathname.split('/').pop()

  return (
    <SidebarWrapper>
      <NavLink to="/payer-projects">
        <NavWrapper>
          <Icon
            iconName="arrow-drop-left"
            width={16} color1={AlphaColors.Black10}
            style={{ marginRight: Spacing.S2 }}
          />
          <BackNavLabel>
            All Payer Projects
          </BackNavLabel>
        </NavWrapper>
      </NavLink>
      <HeaderWrapper>
          <HeaderLabel>Payer Project</HeaderLabel>
          <Header>{ projectName }</Header>
        </HeaderWrapper>
      <Sidebar>
        { sidebarConfig.map(generateSidebarItems({ selectedSidebarItem, url })) }
      </Sidebar>
    </SidebarWrapper>
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
