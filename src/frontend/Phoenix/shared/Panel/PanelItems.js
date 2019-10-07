import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
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
  } = useQuery(fetchSelectedQueryProps.query)
  // TODO: This may not work with Orion,
  // which is why the commented out code still exists.

  // if (fetchSelectedQueryProps) {
    if (loading || _.isEmpty(selectedEntityData)) return null
    if (error) return <div>{error}</div>


    const firstDataKey = Object.keys(selectedEntityData)[0]
    const selectedEntity = selectedEntityData[firstDataKey]

    if (firstDataKey === 'selectedTeam') console.log('from teams panel', selectedEntity.description)
    
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
  // }

  // return (
  //   <div>
  //     {
  //       data.map(entity => (
  //         <PanelItem
  //           key={entity._id}
  //           entity={entity}
  //           panelItemConfig={panelItemConfig}
  //         />
  //       ))
  //     }
  //   </div>
  // )
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
