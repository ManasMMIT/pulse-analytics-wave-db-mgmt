import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Team from '../teams/Team'

const Wrapper = styled.div({
  flex: 1,
  backgroundColor: '#edf1f5',
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
})

const Header = styled.div({
  borderBottom: '2px solid #dfe3e6',
  padding: '24px 0',
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
  padding: 24,
})

const TeamsPanel = ({
  onClick,
  teams,
  client,
  selectedTeam,
}) => (
  <Wrapper>
    <Header>
      <Subtitle>Client</Subtitle>
      <Title>{ client.name }</Title>
    </Header>
    <ListTitle>Teams</ListTitle>
    <div>{
      teams.map(team => {
        const isSelected = team.id === selectedTeam
        return (
          <Team
            key={team.id}
            onClick={onClick}
            team={team}
            isSelected={isSelected}
          />
        )
    })
    }</div>
  </Wrapper>
)

TeamsPanel.defaultProps = {
  teams: [],
  client: { name: '' },
}

TeamsPanel.propTypes = {
  onClick: PropTypes.func.isRequired,
  teams: PropTypes.array,
  client: PropTypes.object,
  selectedTeam: PropTypes.string,
}

export default TeamsPanel