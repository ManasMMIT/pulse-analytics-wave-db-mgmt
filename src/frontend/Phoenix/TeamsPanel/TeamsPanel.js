import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import TeamPanelItems from './TeamPanelItems'
import PanelHeader from './PanelHeader'

const Wrapper = styled.div({
  flex: 1,
  backgroundColor: '#edf1f5',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
})

const TeamsPanel = ({
  handlers,
  teams,
  clientName,
  selectedTeam,
}) => {
  const adminTeam = teams.find(({ isDefault }) => isDefault) || { id: null }
  const nonAdminTeams = teams.filter(({ isDefault }) => !isDefault) || [{ id: null}]

  const adminTeamHandlers = {
    onClick: handlers.onClick
  }

  return (
    <Wrapper>
      <PanelHeader
        clientName={clientName}
        handleSubmit={handlers.createHandler}
        adminTeam={adminTeam}
        selectedTeam={selectedTeam}
        handlers={adminTeamHandlers}
      />
      <TeamPanelItems
        teams={nonAdminTeams}
        selectedTeam={selectedTeam}
        handlers={handlers}
      />
    </Wrapper>
  )
}

TeamsPanel.defaultProps = {
  teams: [],
  client: { name: '' },
}

TeamsPanel.propTypes = {
  handlers: PropTypes.object,
  teams: PropTypes.array,
  client: PropTypes.object,
  selectedTeam: PropTypes.string,
}

export default TeamsPanel
