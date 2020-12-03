import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import SectionTitle from 'frontend/components/SectionTitle'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import ButtonCluster from './ButtonCluster'
import ConnectionForm from './ConnectionForm'

import { ConnectionPanelWrapper } from './styledComponents'

const ConnectionPanel = ({
  connection,
  connections,
  payerOrgById,
  setWhetherNewConnectionBeingCreated,
  isNewConnectionBeingCreated,
  setWhetherUnsavedChanges,
  obmId,
  selectConnectionId,
  allBooks,
}) => {
  const [stagedConnection, stageConnection] = useState(
    _.cloneDeep(connection || {})
  )

  useEffect(() => {
    if (isNewConnectionBeingCreated) {
      stageConnection({
        payerId: null,
        obmId,
        note: null,
        books: [],
      })
    } else {
      stageConnection(_.cloneDeep(connection || {}))
    }
  }, [connection, isNewConnectionBeingCreated])

  const cancelHandler = () => {
    if (isNewConnectionBeingCreated) {
      selectConnectionId(_.isEmpty(connections) ? null : connections[0]._id)
    } else {
      stageConnection(connection)
    }

    setWhetherNewConnectionBeingCreated(false)
    setWhetherUnsavedChanges(false)
  }

  console.log('stagedConnection', stagedConnection)

  if (_.isEmpty(stagedConnection)) return 'No connections'

  return (
    <ConnectionPanelWrapper>
      <SectionTitle
        title={payerOrgById[stagedConnection.payerId]}
        titleStyle={{ ...FontSpace.FS3, color: Color.BLUE }}
      >
        <ButtonCluster
          stagedConnection={stagedConnection}
          cancelHandler={cancelHandler}
          selectConnectionId={selectConnectionId}
          connections={connections}
          isNewConnectionBeingCreated={isNewConnectionBeingCreated}
          setWhetherUnsavedChanges={setWhetherUnsavedChanges}
          setWhetherNewConnectionBeingCreated={
            setWhetherNewConnectionBeingCreated
          }
        />
      </SectionTitle>

      <ConnectionForm
        stagedConnection={stagedConnection}
        stageConnection={stageConnection}
        isNewConnectionBeingCreated={isNewConnectionBeingCreated}
        setWhetherUnsavedChanges={setWhetherUnsavedChanges}
        payerOrgById={payerOrgById}
        allBooks={allBooks}
      />
    </ConnectionPanelWrapper>
  )
}

ConnectionPanel.propTypes = {
  obmId: PropTypes.string.isRequired,
  selectConnectionId: PropTypes.func.isRequired,
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  connections: PropTypes.array.isRequired,
  connection: PropTypes.object,
  allBooks: PropTypes.array.isRequired,
  setWhetherNewConnectionBeingCreated: PropTypes.func.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
}

export default ConnectionPanel
