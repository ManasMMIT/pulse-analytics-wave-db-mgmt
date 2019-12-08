import React, { useState } from 'react'
import styled from '@emotion/styled'

import Connection from './Connection'
import CreateConnectionForm from './CreateConnectionForm'

const SectionHeader = styled.div({
  display: 'flex',
  fontSize: 16,
  fontWeight: 500,
  textDecoration: 'underline',
})

const ConnectionsWrapper = styled.div({
  maxHeight: 400,
  overflowY: 'scroll',
})

const ConnectionsSection = ({
  from,
  vbmConnectionDoc,
  connections,
  refetchQueries,
  isEditModal,
}) => {
  const [showConnectionForm, setShowConnectionForm] = useState(false)

  return (
    <div>
      {
        isEditModal && 
          <SectionHeader>
            <span>Connections </span>
            <button onClick={() => setShowConnectionForm(!showConnectionForm)}>
              add
            </button>
          </SectionHeader>
      }
      {
        ( showConnectionForm &&
          <CreateConnectionForm
            from={from}
            postSubmitHook={() => setShowConnectionForm(false)}
            vbmConnectionDoc={vbmConnectionDoc}
            refetchQueries={refetchQueries}
          />
        )
      }
      <ConnectionsWrapper>
        { connections &&
          connections.map(connection => (
              <Connection
                key={JSON.stringify(connection)}
                from={from}
                to={connection}
                refetchQueries={refetchQueries}
            />
            )
          )
        }
      </ConnectionsWrapper>
    </div>
  )
}

export default ConnectionsSection
