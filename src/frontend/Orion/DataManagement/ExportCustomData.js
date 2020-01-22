import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import {
  RUN_PIPE_DELIMITED_SCRIPT,
} from './../../api/mutations'

const ExportCustomData = () => {
  const [runPipeDelimitedScript] = useMutation(RUN_PIPE_DELIMITED_SCRIPT)

  return (
    <div style={{ padding: 24 }}>
      <h1>Export Custom Data</h1>
      <div>
        <p>Pressing this button will save files to the server, which can then be grabbed.</p>
        <button
          onClick={runPipeDelimitedScript}
        >
          Pipe Delimited Script
        </button>
      </div>
    </div>
  )
}

export default ExportCustomData