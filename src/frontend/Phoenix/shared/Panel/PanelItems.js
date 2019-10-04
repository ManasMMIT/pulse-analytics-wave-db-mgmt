import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import _ from 'lodash'

import PanelItem from './PanelItem'

const PanelItems = ({
  data,
  fetchSelectedQueryProps,
  panelItemConfig,
}) => {
  if (fetchSelectedQueryProps) {
    return (
      <Query {...fetchSelectedQueryProps}>
        {({ data: selectedEntityData, loading, error, client }) => {
          debugger

          if (loading) return null

          if (_.isEmpty(data)) {
            return null
          }

          if (_.isEmpty(selectedEntityData)) {
            client.writeQuery({
              query: fetchSelectedQueryProps.query,
              data: { selectedClient: data[0] },
            })

            return null
          }

          const firstDataKey = Object.keys(selectedEntityData)[0]
          const selectedEntity = selectedEntityData[firstDataKey]
          debugger

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
  }

  return (
    <div>
      {
        data.map(entity => (
          <PanelItem
            key={entity._id}
            entity={entity}
            panelItemConfig={panelItemConfig}
          />
        ))
      }
    </div>
  )
}

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
