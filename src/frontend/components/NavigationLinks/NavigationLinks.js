import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Colors, Spacing } from '../../utils/pulseStyles'

import NavigationLink from './NavigationLink'
import Dropdown from './Dropdown'

const NavigationLinkContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const Header = styled.div({
  padding: `${Spacing.NORMAL} ${Spacing.LARGE}`,
  fontSize: 10,
  fontWeight: 500,
  color: transparentize(0.7, Colors.WHITE),
  textTransform: 'uppercase',
  letterSpacing: 0.6,
})

// * recursively nest link items
const getNestedLinkItems = (listConfig, isSuperUser, parentLink = null) => {
  const data = []

  listConfig.forEach(({ label, link, showOnSuperUserOnly, childLinks }) => {
    const combinedLink = parentLink ? `${parentLink}${link}` : link

    const nestedLinks = childLinks
      ? getNestedLinkItems(childLinks, isSuperUser, combinedLink)
      : null

    let component = childLinks ? (
      <Dropdown key={label} label={label}>
        {nestedLinks}
      </Dropdown>
    ) : (
      <NavigationLink key={label} link={combinedLink} label={label} />
    )

    if (showOnSuperUserOnly) {
      if (isSuperUser) data.push(component)
    } else {
      data.push(component)
    }
  })

  return data
}

// * will also supported non-nested links!
const NavigationLinks = ({ sectionHeader, linkConfig, isSuperUser }) => {
  const links = getNestedLinkItems(linkConfig, isSuperUser)

  return (
    <NavigationLinkContainer>
      <Header>{sectionHeader}</Header>
      {links}
    </NavigationLinkContainer>
  )
}

NavigationLinks.propTypes = {
  sectionHeader: PropTypes.string,
  linkConfig: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      link: PropTypes.string,
      showOnSuperUserOnly: PropTypes.bool,
      childLinks: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          link: PropTypes.string,
          showOnSuperUserOnly: PropTypes.bool,
          childLinks: PropTypes.array,
        })
      ),
    })
  ),
  isSuperUser: PropTypes.bool,
}

NavigationLinks.defaultProps = {
  sectionHeader: 'Section Header',
  linkConfig: [{ label: '', link: '', childLinks: null }],
  isSuperUser: false,
}

export default NavigationLinks
