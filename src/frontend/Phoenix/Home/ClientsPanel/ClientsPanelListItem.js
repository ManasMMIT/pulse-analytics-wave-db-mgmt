import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'

import Color from 'frontend/utils/color'
import Spacing from 'frontend/utils/spacing'

import UpdateButton from './UpdateButton'

const DEFAULT_WRAPPER_STYLE = {
  cursor: 'pointer',
  color: transparentize(0.4, Color.WHITE),
  margin: `0 ${Spacing.S4}`,
  borderRadius: 4,
  padding: `${Spacing.S4} ${Spacing.S4}`,
  textDecoration: 'none',
  fontSize: 11,
  fontWeight: 600,
  lineHeight: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const activePanelItemStyle = {
  color: Color.WHITE,
  background: transparentize(0.9, Color.WHITE),
}

const Wrapper = styled.div(DEFAULT_WRAPPER_STYLE, ({ style }) => ({
  ...style,
}))

const Title = ({ description, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {icon ? (
      <div
        style={{
          background: Color.WHITE,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          marginRight: Spacing.S5,
        }}
      >
        <img
          style={{ width: 20, height: 'auto' }}
          src={icon}
          alt={`#{description}-icon`}
        />
      </div>
    ) : null}
    <span style={{ fontSize: 13 }}>{description}</span>
  </div>
)

const ClientsPanelListItem = ({
  data,
  isSelected,
  handleClick,
  searchParamKey,
}) => {
  const listItemHandleClick = isSelected
    ? () => null
    : () => handleClick(data[searchParamKey])

  const style = isSelected ? activePanelItemStyle : {}

  return (
    <Wrapper onClick={listItemHandleClick} style={style}>
      <div>
        <div>
          <Title description={data.description} icon={data.icon} />
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <UpdateButton
          client={data}
          handleClick={handleClick}
          searchParamKey={searchParamKey}
        />
        {/* <DeleteButton clientId={client._id} /> */}
      </div>
    </Wrapper>
  )
}

ClientsPanelListItem.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  searchParamKey: PropTypes.string.isRequired,
}

export default ClientsPanelListItem
