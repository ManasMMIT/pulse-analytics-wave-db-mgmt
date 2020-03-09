import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Spinner from './../../Phoenix/shared/Spinner'
import { useAuth0 } from '../../../react-auth0-spa'
import FileSaver from 'file-saver'
import { Colors } from '../../utils/pulseStyles'

const MERCK_URL = '/api/merck-pipe-delimited-file'
const NOVARTIS_URL = '/api/novartis-csv-file'

const ExportCustomData = () => {
  const { accessToken } = useAuth0()
  const [isMerckScriptLoading, setMerckLoadingStatus] = useState(false)
  const [isNvsScriptLoading, setNovartisLoadingStatus] = useState(false)

  const clickHandler = (url, setLoadingStatusFn) => async (e) => {
    e.preventDefault()
    setLoadingStatusFn(true)

    await fetch(url, {
        method: 'GET',
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
      .catch(console.error)

      setLoadingStatusFn(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Export Custom Data</h1>
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={clickHandler(MERCK_URL, setMerckLoadingStatus)}
        >
          <span style={{ marginRight: 8 }}>Download Merck Pipe Delimited CSV and TXT Files</span>
          { isMerckScriptLoading && <Spinner />}
        </Button>
      </div>
      <div style={{ marginTop: 24 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={clickHandler(NOVARTIS_URL, setNovartisLoadingStatus)}
        >
          <span style={{ marginRight: 8 }}>Download Kymriah Cart-T CSV File</span>
          { isNvsScriptLoading && <Spinner fill={Colors.RED} />}
        </Button>
      </div>
    </div>
  )
}

export default ExportCustomData