import React from 'react'
import { useQuery } from '@apollo/react-hooks'

import ToolTimestamp from './ToolTimestamp'
import { GET_SOURCE_TOOLS } from '../../../../api/queries'
import Spinner from 'frontend/components/Spinner'

const ToolsTimestamps = () => {
  const { data, loading } = useQuery(GET_SOURCE_TOOLS)

  if (loading) return <Spinner />

  return (
    <div style={{ padding: 0 }}>
      <table style={{ width: '100%' }}>
        <tbody>
          {
            data.nodes.map(({ _id, name, text }) => (
              <ToolTimestamp
                key={_id}
                toolId={_id}
                toolName={name}
                prevTimestamp={text.tdgTimestamp}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ToolsTimestamps
