import React from 'react'
import PropTypes from 'prop-types'

import TeamPanelItem from './TeamPanelItem'

const TeamPanelItems = ({
  teams,
  selectedTeam,
  handlers,
}) => (
  <>
    {
      teams.map(team => {
        return (
          <TeamPanelItem
            key={team.name}
            team={team}
            selectedTeam={selectedTeam}
            handlers={handlers}
          />
        )
      })
    }
  </>
)

TeamPanelItems.propTypes = {
  teams: PropTypes.array,
  selectedTeam: PropTypes.string,
  handlers: PropTypes.object,
}

export default TeamPanelItems
