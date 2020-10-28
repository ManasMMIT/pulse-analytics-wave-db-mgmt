import React from 'react'
import PropTypes from 'prop-types'

import ListItem from 'frontend/components/List/ListItem'
import Icon from 'frontend/components/Icon'
// import Tag from 'frontend/components/Tag'

import Color from 'frontend/utils/color'

import {
  ContentWrapper,
  TextWrapper,
  OrganizationType,
  Title,
  Subtitle,
  Description,
  IconWrapper,
  listItemStyle,
} from '../../../shared/widget/ConnectionsList/styledComponents'

const ConnectionListItem = ({
  formatter,
  isActive,
  isDisabled,
  // hasPrimaryAffiliation,
  value,
  clickHandler,
}) => {
  const { organization, organizationType, description, position } = value
  // For Outdated date formatting
  const formattedDescription = formatter ? formatter(description) : description
  // TODO: Wire in primary affiliation tag
  // const shouldShowAffiliationTag = !isActive && hasPrimaryAffiliation
  return (
    <ListItem style={listItemStyle} clickHandler={clickHandler} value={value}>
      <ContentWrapper isActive={isActive}>
        <TextWrapper isActive={isActive} isDisabled={isDisabled}>
          <OrganizationType>{organizationType}</OrganizationType>
          <Title>{organization}</Title>
          <Subtitle>{position}</Subtitle>
          <Description>{formattedDescription}</Description>
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
