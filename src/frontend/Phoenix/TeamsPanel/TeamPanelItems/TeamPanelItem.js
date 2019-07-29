import React from 'react'
import PropTypes from 'prop-types'

import PanelItem from '../../shared/PanelItem'

import TextFormButton from '../../shared/TextForm/Button'
import DeleteButton from '../../shared/DeleteButton'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
const editIcon = <FontAwesomeIcon size="lg" icon={faEdit} />

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

  return (
    <PanelItem
      key={team.id}
      itemId={team.id}
      label={team.description}
      style={style}
      onClick={handlers.onClick}
    >
      <span>
        {handlers.editHandler && (
          <TextFormButton
            data={{ description: team.description }}
            handleSubmit={handlers.editHandler}
            buttonLabel={editIcon}
            buttonStyle={{ border: 'none', background: 'none', color: '#b6b9bc' }}
            modalTitle={'Edit Team'}
          />
        )}

        <span>
          {handlers.deleteHandler && (
            <DeleteButton
              itemId={team.id}
              deleteHandler={handlers.deleteHandler}
            />
          )}
        </span>
      </span>
    </PanelItem>
  )
}

TeamPanelItem.propTypes = {
  team: PropTypes.object,
  selectedTeam: PropTypes.string,
  handlers: PropTypes.object,
}

export default TeamPanelItem
