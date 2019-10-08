import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'

const PanelItem = ({
  selectedEntity,
  entity,
  panelItemConfig: {
    selectEntityMutationDoc,
    style,
    activeStyle,
    inactiveStyle,
    buttonGroupCallback = () => null,
    label1Callback = () => null,
    label2Callback = () => null,
  },
}) => {
  const isSelected = entity._id === selectedEntity._id

  let finalStyle = style
  if (isSelected) {
    finalStyle = { ...finalStyle, ...activeStyle }
  } else {
    finalStyle = { ...finalStyle, ...inactiveStyle }
  }

  const [handleSelect] = useMutation(selectEntityMutationDoc)

  return (
    <div
      style={finalStyle}
      onClick={handleSelect.bind(null, { variables: { _id: entity._id } })}
    >
      <div>
        <div>{label1Callback(entity)}</div>

        <div style={{ fontWeight: 300, fontStyle: 'italic' }}>
          {label2Callback(entity)}
        </div>
      </div>

      <div>
        {buttonGroupCallback(entity)}
      </div>
    </div>
  )

  // return (
  //   <div style={finalStyle}>
  //     <div>
  //       <div>{label1Callback(entity)}</div>

  //       <div style={{ fontWeight: 300, fontStyle: 'italic' }}>
  //         {label2Callback(entity)}
  //       </div>
  //     </div>

  //     <div>
  //       {buttonGroupCallback(entity)}
  //     </div>
  //   </div>
  // )
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
    label1Callback: PropTypes.func,
    label2Callback: PropTypes.func,
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
    label1Callback: () => null,
    label2Callback: () => null,
  }
}

export default PanelItem
