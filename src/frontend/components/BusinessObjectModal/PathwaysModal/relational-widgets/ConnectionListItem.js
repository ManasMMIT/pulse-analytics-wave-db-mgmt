import React from 'react'
import PropTypes from 'prop-types'

import ListItem from 'frontend/components/List/ListItem'
import Icon from 'frontend/components/Icon'
// import Tag from 'frontend/components/Tag'

import Color from 'frontend/utils/color'

import {
  ContentWrapper,
  TextWrapper,
  Title,
  Subtitle,
  IconWrapper,
  listItemStyle,
} from './../../shared/widget/ConnectionsList/styledComponents'

const ConnectionListItem = ({ isActive, isDisabled, value, clickHandler }) => {
  const { firstName, lastName, position } = value

  return (
    <ListItem style={listItemStyle} clickHandler={clickHandler} value={value}>
      <ContentWrapper isActive={isActive}>
        <TextWrapper isActive={isActive} isDisabled={isDisabled}>
          <Title>{firstName + ' ' + lastName}</Title>
          <Subtitle>{position}</Subtitle>
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
      </ContentWrapper>
    </ListItem>
  )
}

ConnectionListItem.propTypes = {
  isActive: PropTypes.bool,
  value: PropTypes.any,
  clickHandler: PropTypes.func,
}

ConnectionListItem.defaultProps = {
  isActive: false,
  value: null,
  clickHandler: () => {},
}

export default ConnectionListItem
