import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import PanelItem from "./../PanelItem";

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
  handlers,
  teams,
  clientName,
  selectedTeam,
}) => (
  <Wrapper>
    <Header>
      <Subtitle>Client</Subtitle>
      <Title>{ clientName }</Title>
    </Header>
    <ListTitle>Teams</ListTitle>
    <div>{
      teams.map(team => {
        const isSelected = team.id === selectedTeam
        const style = {
          cursor: isSelected ? "default" : "pointer",
          backgroundColor: isSelected ? "#f8fafb" : null,
          padding: 24,
          color: isSelected ? "#2a7ad3" : "#838c96",
          borderLeft: isSelected
            ? "4px solid #1f6cc7"
            : "4px solid transparent"
        };

        return (
          <PanelItem
            style={style}
            key={team.id}
            handlers={handlers}
            item={team}
            text={team.description}
          />
        );
    })
    }</div>
  </Wrapper>
)

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