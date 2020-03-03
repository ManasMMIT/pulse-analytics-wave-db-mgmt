import React from 'react'
import Spinner from './../../Phoenix/shared/Spinner'

const ExportCustomData = () => {
  // const [runPipeDelimitedScript, { loading }] = useMutation(RUN_PIPE_DELIMITED_SCRIPT)

  return (
    <div style={{ padding: 24 }}>
      <h1>Export Custom Data</h1>
      <div>
        <p>Pressing this button will save files to the server, which can then be grabbed.</p>
      </div>
    </div>
  )
}

export default ExportCustomData