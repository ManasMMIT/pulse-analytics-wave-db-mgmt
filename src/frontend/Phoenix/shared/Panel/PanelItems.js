import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

import PanelItem from './PanelItem'

const PanelItems = ({
  data,
  fetchSelectedQueryProps,
  panelItemConfig,
}) => (
  <Query {...fetchSelectedQueryProps}>
    {({ data: selectedEntityData }) => {
      const firstDataKey = Object.keys(selectedEntityData)[0]
      const selectedEntity = selectedEntityData[firstDataKey]

      return (
        <div>
          {
            data.map(entity => (
              <PanelItem
                key={entity._id}
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
  fetchSelectedQueryProps: PropTypes.object,
  panelItemConfig: PanelItem.propTypes.panelItemConfig,
}

PanelItems.defaultProps = {
  data: [],
  fetchSelectedQueryProps: null,
  panelItemConfig: PanelItem.defaultProps.panelItemConfig,
}

export default PanelItems
