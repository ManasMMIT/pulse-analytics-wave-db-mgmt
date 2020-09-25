import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import ListItem from 'frontend/components/List/ListItem'
import Icon from 'frontend/components/Icon'
// import Tag from 'frontend/components/Tag'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

const ContentWrapper = styled.div(
  {
    display: 'flex',
    justifyContent: 'space-between',
    padding: Spacing.S4,
    borderRadius: 4,
    ':hover': {
      cursor: 'pointer',
    },
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? transparentize(0.85, Color.BLUE) : Color.WHITE,
  })
)

const TextWrapper = styled.div({}, ({ isActive, isDisabled }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  color: isActive ? Color.PRIMARY : Color.BLACK,
  opacity: isDisabled ? 0.5 : 1,
  fontStyle: isDisabled ? 'italic' : 'normal',
}))

const OrganizationType = styled.div({
  ...FontSpace.FS2,
  lineHeight: '18px',
  fontWeight: 500,
  fontStyle: 'inherit',
})

const Title = styled.div({
  ...FontSpace.FS2,
  lineHeight: '18px',
  fontWeight: 700,
  fontStyle: 'inherit',
})

const Subtitle = styled.div({
  ...FontSpace.FS2,
  fontWeight: 400,
  lineHeight: '18px',
  fontStyle: 'inherit',
})

const Description = styled.div({
  ...FontSpace.FS2,
  lineHeight: '15px',
  fontStyle: 'inherit',
})

const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const listItemStyle = {
  padding: `6px ${Spacing.S4}`,
}

const ConnectionListItem = ({
  organizationType,
  title,
  subtitle,
  description,
  isActive,
  isDisabled,
  // hasPrimaryAffiliation,
  value,
  clickHandler,
}) => {
  // TODO: Wire in primary affiliation tag
  // const shouldShowAffiliationTag = !isActive && hasPrimaryAffiliation
  return (
    <ListItem style={listItemStyle} clickHandler={clickHandler} value={value}>
      <ContentWrapper isActive={isActive}>
        <TextWrapper isActive={isActive} isDisabled={isDisabled}>
          <OrganizationType>{organizationType}</OrganizationType>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          <Description>{description}</Description>
        </TextWrapper>
        {isActive && (
          <IconWrapper>
            <Icon
              iconName="arrow-drop-right"
              color1={Color.PRIMARY}
              width={16}
            />
          </IconWrapper>
        )}
        {/* {shouldShowAffiliationTag && (
          <div>
            <Tag text="Primary Affiliation" color={Color.PURPLE} />
          </div>
        )} */}
      </ContentWrapper>
    </ListItem>
  )
}

ConnectionListItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  isActive: PropTypes.bool,
  value: PropTypes.any,
  clickHandler: PropTypes.func,
}

ConnectionListItem.defaultProps = {
  subtitle: '',
  description: '',
  isActive: false,
  value: null,
  clickHandler: () => {},
}

export default ConnectionListItem
