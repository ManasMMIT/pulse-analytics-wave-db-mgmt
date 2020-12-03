import React from 'react'
import PropTypes from 'prop-types'

import ListItem from 'frontend/components/List/ListItem'
import Icon from 'frontend/components/Icon'

import Color from 'frontend/utils/color'

import {
  ContentWrapper,
  TextWrapper,
  Title,
  Subtitle,
  IconWrapper,
  listItemStyle,
} from 'frontend/components/BusinessObjectModal/shared/widget/ConnectionsList/styledComponents'

const ConnectionListItem = ({ isActive, clickHandler, title, subtitle }) => {
  return (
    <ListItem style={listItemStyle} clickHandler={clickHandler}>
      <ContentWrapper isActive={isActive}>
        <TextWrapper isActive={isActive}>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
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
  clickHandler: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

export default ConnectionListItem
