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
  mbmIdObj,
  selectConnectionId,
  allBooks,
  refetchQueries,
  mutationDocs,
}) => {
  const [stagedConnection, stageConnection] = useState(
    _.cloneDeep(connection || {})
  )

  useEffect(() => {
    if (isNewConnectionBeingCreated) {
      stageConnection({
        payerId: null,
        ...mbmIdObj,
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

  if (_.isEmpty(stagedConnection)) return <>No connections</>

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
          refetchQueries={refetchQueries}
          mutationDocs={mutationDocs}
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
  mbmIdObj: PropTypes.object.isRequired,
  selectConnectionId: PropTypes.func.isRequired,
  isNewConnectionBeingCreated: PropTypes.bool.isRequired,
  connections: PropTypes.array.isRequired,
  connection: PropTypes.object,
  allBooks: PropTypes.array.isRequired,
  setWhetherNewConnectionBeingCreated: PropTypes.func.isRequired,
  setWhetherUnsavedChanges: PropTypes.func.isRequired,
  refetchQueries: PropTypes.arrayOf(PropTypes.object).isRequired,
  mutationDocs: PropTypes.object.isRequired,
}

export default ConnectionPanel
