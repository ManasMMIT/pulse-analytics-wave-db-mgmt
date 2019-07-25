import React from 'react'
import PropTypes from 'prop-types'

import PanelItem from '../../shared/PanelItem'
import TextForm from './../../../components/forms/TextForm'

const TeamPanelItem = ({
  team,
  selectedTeam,
  handlers,
}) => {
  const isSelected = team.id === selectedTeam

  const style = {
    cursor: isSelected ? "default" : "pointer",
    backgroundColor: isSelected ? "#f8fafb" : null,
    padding: 24,
    color: isSelected ? "#2a7ad3" : "#838c96",
    borderLeft: isSelected
      ? "4px solid #1f6cc7"
      : "4px solid transparent"
  }

  const editForm = (
    <TextForm
      data={{ description: team.description }}
      handleSubmit={handlers.editHandler}
    />
  )

  return (
    <PanelItem
      style={style}
      key={team.id}
      editForm={editForm}
      handlers={handlers}
      item={team}
      text={team.description}
    />
  )
}

TeamPanelItem.propTypes = {
  team: PropTypes.object,
  selectedTeam: PropTypes.string,
  handlers: PropTypes.object,
}

export default TeamPanelItem
