import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'

const PanelItem = ({
  selectedEntity,
  entity,
  panelItemConfig: {
    selectEntityMutationDoc,
    style,
    activeStyle,
    inactiveStyle,
    buttonGroupCallback = () => null,
  },
}) => {
  const isSelected = entity.id === selectedEntity.id

  let finalStyle = style
  if (isSelected) {
    finalStyle = { ...finalStyle, ...activeStyle }
  } else {
    finalStyle = { ...finalStyle, ...inactiveStyle }
  }

  return (
    <Mutation mutation={selectEntityMutationDoc}>
      {handleSelect => {
        return (
          <div
            style={finalStyle}
            onClick={handleSelect.bind(null, { variables: { id: entity.id } })}
          >
            <span>{entity.description || entity.username}</span>

            <span>
              {buttonGroupCallback(entity)}
            </span>
          </div>
        )
      }}
    </Mutation>
  )
}

PanelItem.propTypes = {
  selectedEntity: PropTypes.object,
  entity: PropTypes.object,
  panelItemConfig: PropTypes.shape({
    selectEntityMutationDoc: PropTypes.object,
    style: PropTypes.object,
    activeStyle: PropTypes.object,
    inactiveStyle: PropTypes.object,
    buttonGroupCallback: PropTypes.func,
  }),
}

PanelItem.defaultProps = {
  selectedEntity: {},
  entity: {},
  panelItemConfig: {
    selectEntityMutationDoc: null,
    style: {},
    activeStyle: {},
    inactiveStyle: {},
    buttonGroupCallback: () => null,
  }
}

export default PanelItem
