import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import PanelItem from './PanelItem'

const PanelItems = ({
  data,
  fetchSelectedEntity,
  panelItemConfig,
}) => (
  <Query query={fetchSelectedEntity}>
    {({ data: selectedEntityData }) => {
      const firstDataKey = Object.keys(selectedEntityData)[0]
      const selectedEntity = selectedEntityData[firstDataKey]

      return (
        <div>
          {
            data.map(entity => (
              <PanelItem
                key={entity.id}
                selectedEntity={selectedEntity}
                entity={entity}
                panelItemConfig={panelItemConfig}
              />
            ))
          }
        </div>
      )
    }}
  </Query>
)

PanelItems.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  fetchSelectedEntity: PropTypes.object,
  panelItemConfig: PanelItem.propTypes.panelItemConfig,
}

PanelItems.defaultProps = {
  data: [],
  fetchSelectedEntity: null,
  panelItemConfig: PanelItem.defaultProps.panelItemConfig,
}

export default PanelItems
