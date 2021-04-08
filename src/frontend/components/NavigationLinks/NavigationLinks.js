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
const getNestedLinkItems = (listConfig, parentLink = null) => {
  const data = []

  listConfig.forEach(({ label, link, childLinks }) => {
    const combinedLink = parentLink ? `${parentLink}${link}` : link

    const nestedLinks = childLinks
      ? getNestedLinkItems(childLinks, combinedLink)
      : null

    let component = childLinks ? (
      <Dropdown key={label} label={label}>
        {nestedLinks}
      </Dropdown>
    ) : (
      <NavigationLink key={label} link={combinedLink} label={label} />
    )

    data.push(component)
  })

  return data
}

// * will also supported non-nested links!
const NavigationLinks = ({ sectionHeader, linkConfig }) => {
  const links = getNestedLinkItems(linkConfig)

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
      childLinks: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          link: PropTypes.string,
          childLinks: PropTypes.array,
        })
      ),
    })
  ),
}

NavigationLinks.defaultProps = {
  sectionHeader: 'Section Header',
  linkConfig: [{ label: '', link: '', childLinks: null }],
}

export default NavigationLinks
