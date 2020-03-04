import React from 'react'
import Button from '@material-ui/core/Button'
import Spinner from './../../Phoenix/shared/Spinner'

import { Auth0Context } from '../../../react-auth0-spa'

class ExportCustomData extends React.Component {

  downloadCSVFile = (e) => {
    e.preventDefault()
    const { accessToken } = this.context

    fetch('/api/merck-pipe-delimited-file', {
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
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click()    
        a.remove()  //afterwards we remove the element again 
      })
      .catch(err => console.err)
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <h1>Export Custom Data</h1>
        <div>
          <p>Pressing this button will save files to the server, which can then be grabbed.</p>
          <Button variant="outlined" color="primary" onClick={this.downloadCSVFile}>
            Download Merck Pipe Delimited CSV and PSV Files
          </Button>
        </div>
      </div>
    )
  }
}

ExportCustomData.contextType = Auth0Context

export default ExportCustomData