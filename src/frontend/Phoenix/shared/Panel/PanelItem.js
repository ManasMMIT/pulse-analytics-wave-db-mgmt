import React from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

const Wrapper = styled.div(
  {},
  ({ style }) => style,
)
const PanelItem = ({
  finalStyle,
  entity,
  panelItemConfig: {
    selectEntityMutationDoc,
    buttonGroupCallback,
    label1Callback,
    label2Callback,
  },
}) => {
  const [handleSelect] = useMutation(selectEntityMutationDoc)

  return (
    <Wrapper style={finalStyle}
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
    </Wrapper>
  )
}

const PanelItemContainer = ({
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
  const isSelected = selectedEntity ? entity._id === selectedEntity._id : false

  let finalStyle = style
  if (isSelected) {
    finalStyle = { ...finalStyle, ...activeStyle }
  } else {
    finalStyle = { ...finalStyle, ...inactiveStyle }
  }

  if (!selectEntityMutationDoc) {
    return (
      <Wrapper style={finalStyle}>
        <div>
          <div>{label1Callback(entity)}</div>

          <div style={{ fontWeight: 300, fontStyle: 'italic' }}>
            {label2Callback(entity)}
          </div>
        </div>

        <div>
          {buttonGroupCallback(entity)}
        </div>
      </Wrapper>
    )
  }


  return (
    <PanelItem
      finalStyle={finalStyle}
      entity={entity}
      panelItemConfig={{
        selectEntityMutationDoc,
        buttonGroupCallback,
        label1Callback,
        label2Callback,
      }}
    />
  )
}

PanelItemContainer.propTypes = {
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

PanelItemContainer.defaultProps = {
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

export default PanelItemContainer
