import React from 'react'

import {
  panelItemStyle,
  panelItemActiveStyle,
} from 'frontend/Phoenix/SitemapPanel/shared/panelStyles'
import EditModalButton from './EditModalButton'

const NodeMgmtPanelItem = ({ isSelected, handleClick, node }) => {
  const activeStyleObj = isSelected ? panelItemActiveStyle : {}

  const finalStyle = {
    ...panelItemStyle,
    ...activeStyleObj,
    minHeight: 70,
  }

  return (
    <div onClick={handleClick} style={finalStyle}>
      <div>{node.name}</div>
      {isSelected ? (
        <div>
          <EditModalButton node={node} />
        </div>
      ) : null}
    </div>
  )
}

export default NodeMgmtPanelItem
