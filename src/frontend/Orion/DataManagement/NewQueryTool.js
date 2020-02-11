import React, { useState } from 'react'
import Inspector from 'react-inspector'

import { useAuth0 } from '../../../react-auth0-spa'
import Spinner from './../../Phoenix/shared/Spinner'

const PQL_URL = 'http://localhost:3000/pql'

const submitPQL = (accessToken, pql, setData, setLoading) => {
  setLoading(true)

  fetch(
    PQL_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ pql })
    }
  )
    .then(res => res.json())
    .then(res => {
      setData(res)
      setLoading(false)
    })
}

const NewQueryTool = () => {
  const [data, setData] = useState([])
  const [pql, setPql] = useState('')
  const [loading, setLoading] = useState(false)

  const { accessToken } = useAuth0()

  return (
    <div style={{ margin: 12 }}>
      <h1 style={{ padding: 12 }}>New Query Tool</h1>
      <h2 style={{ margin: 12 }}>PQL</h2>
      <form style={{ margin: 12, boxSizing: 'border-box' }}>
        <input
          style={{ width: '94%', height: 20, padding: 4 }}
          placeholder="Example: orgType=(Payer,Provider)"
          type="text"
          value={pql}
          onChange={e => setPql(e.target.value)}
        />
        <button
          style={{ width: '5%', padding: 8 }}
          onClick={e => {
            e.preventDefault()
            submitPQL(accessToken, pql, setData, setLoading)
          }}
        >
          Submit
        </button>
      </form>
      {
        loading && <Spinner />
      }
      {
        data.error && <span style={{ color: 'red' }}>{data.error}</span>
      }
      <div style={{ padding: 12 }}>
        <h2>Results</h2>
        <Inspector
          table
          theme="chromeDark"
          data={data.error ? [] : data}
        />
      </div>
    </div>
  )
}

export default NewQueryTool
