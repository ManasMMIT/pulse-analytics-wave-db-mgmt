import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import TextFormButton from "../shared/TextForm/Button"
import TeamPanelItem from './TeamPanelItems/TeamPanelItem'

const Header = styled.div({
  borderBottom: '2px solid #dfe3e6',
  padding: '24px 0',
})

const Subheader = styled.div({
  padding: 24,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Title = styled.div({
  fontWeight: 700,
  fontSize: 24,
  padding: '2px 24px'
})

const Subtitle = styled.div({
  fontWeight: 500,
  color: '#a5acb2',
  padding: '2px 24px',
})

const ListTitle = styled.div({
  color: '#a5acb2',
  fontWeight: 500,
})

const CREATE_BUTTON_TXT = 'Create Team'
const CREATE_MODAL_TITLE = "Create New Team"

const createButtonStyle = {
  background: '#d4e2f2',
  color: '#1d66b8',
}

const PanelHeader = ({
  clientName,
  handleSubmit,
  adminTeam,
  handlers,
  selectedTeam,
}) => {
  return (
    <>
      <Header>
        <Subtitle>
          Client
        </Subtitle>
        <Title>
          {clientName}
        </Title>
      </Header>
      <Subheader>
        <ListTitle>Teams</ListTitle>
        <TextFormButton
          modalTitle={CREATE_MODAL_TITLE}
          buttonLabel={CREATE_BUTTON_TXT}
          buttonStyle={createButtonStyle}
          handleSubmit={handleSubmit}
        />
      </Subheader>
      <TeamPanelItem
        team={adminTeam}
        handlers={handlers}
        selectedTeam={selectedTeam}
      />
    </>
  )
}

PanelHeader.propTypes = {
  clientName: PropTypes.string,
  handleSubmit: PropTypes.func,
}

export default PanelHeader
