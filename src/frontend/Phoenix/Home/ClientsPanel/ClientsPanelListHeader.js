import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import PropTypes from 'prop-types'

import Color from 'frontend/utils/color'

import CreateButton from './CreateButton'

const CLIENTS_TITLE = 'Clients'

const Header = styled.div({
  backgroundColor: Color.TOOL_SIDEBAR,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 100, // ! should be sourced from centralized style-guide file in the future
})

const Title = styled.div({
  color: transparentize(0.5, Color.WHITE),
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.2px',
  padding: 24,
  textTransform: 'uppercase',
})

const ClientsPanelListHeader = ({ handleClick }) => {
  return (
    <Header>
      <Title>{CLIENTS_TITLE}</Title>
      <div style={{ paddingRight: 24 }}>
        <CreateButton handleClick={handleClick} searchParamKey={'_id'} />
      </div>
    </Header>
  )
}

ClientsPanelListHeader.propTypes = {
  handleClick: PropTypes.func.isRequired,
}

export default ClientsPanelListHeader
