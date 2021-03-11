import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import _ from 'lodash'

import PanelItem from './PanelItem'

const PanelItems = ({
  data,
  fetchSelectedQueryProps,
  panelItemConfig,
}) => {
  const {
    data: selectedEntityData,
    loading,
    error,
  } = useQuery(fetchSelectedQueryProps.query,
    { returnPartialData: true },
  )

  if (loading || _.isEmpty(data)) return null
  if (error) return <div>{error}</div>

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
}

const PanelItemsContainer = ({
  data,
  fetchSelectedQueryProps,
  panelItemConfig,
}) => {
  if (!fetchSelectedQueryProps) {
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

  return (
    <PanelItems
      data={data}
      fetchSelectedQueryProps={fetchSelectedQueryProps}
      panelItemConfig={panelItemConfig}
    />
  )
}

PanelItemsContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  fetchSelectedQueryProps: PropTypes.object,
  panelItemConfig: PanelItem.propTypes.panelItemConfig,
}

PanelItemsContainer.defaultProps = {
  data: [],
  fetchSelectedQueryProps: null,
  panelItemConfig: PanelItem.defaultProps.panelItemConfig,
}

export default PanelItemsContainer
