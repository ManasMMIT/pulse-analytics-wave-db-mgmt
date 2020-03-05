import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Spinner from './../../Phoenix/shared/Spinner'
import { useAuth0 } from '../../../react-auth0-spa'
import FileSaver from 'file-saver'

const ExportCustomData = () => {
  const { accessToken } = useAuth0()
  const [loading, setLoadingStatus] = useState(false)

  const clickHandler = async (e) => {
    e.preventDefault()
    setLoadingStatus(true)

    await fetch('/api/merck-pipe-delimited-file', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ accessToken }`,
          'Content-Type': 'application/json'
        },
      })
      .then(async response => ({
        blob: await response.blob(),
        filename: response.headers.get('Content-Disposition').split("filename=")[1]
      }))
      .then(({ blob, filename }) => {
        FileSaver.saveAs(blob, filename)
      })
      .catch(err => console.err)

      setLoadingStatus(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Export Custom Data</h1>
      <div>
        <Button variant="outlined" color="primary" onClick={clickHandler}>
          <span style={{ marginRight: 8 }}>Download Merck Pipe Delimited CSV and TXT Files</span>
          { loading && <Spinner />}
        </Button>
      </div>
    </div>
  )
}

export default ExportCustomData