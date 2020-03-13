import React, { useState } from 'react'

import Inspector from 'react-inspector'

import useAquila from '../../../hooks/useAquila'

import Spinner from './../../Phoenix/shared/Spinner'
import { useEffect } from 'react'

const NewQueryTool = () => {
  const [
    filterConfigOptions,
    setFilterConfigOptions,
  ] = useState([])
  const [
    placardOptions,
    setPlacardOptions,
  ] = useState([])

  const {
    setPql,
    data: { pql, results },
    getFilterConfigOptions,
    getPlacardOptions,
    loading,
    submitPql,
  } = useAquila()

  useEffect(() => {
    getPlacardOptions().then(result => {
      setPlacardOptions(result)
    })

    getFilterConfigOptions().then(result => {
      setFilterConfigOptions(result)
    })
  }, [])

  return (
    <div style={{ margin: 12 }}>
      <h1 style={{ padding: 12 }}>New Query Tool</h1>
      <h2 style={{ margin: 12 }}>PQL</h2>
      <form style={{ margin: 12, boxSizing: 'border-box' }}>
        <input
          style={{ width: '94%', height: 20, padding: 4 }}
          type="text"
          value={pql}
          onChange={e => setPql(e.target.value)}
        />
        <button
          style={{ width: '5%', padding: 8 }}
          onClick={e => {
            e.preventDefault()
            submitPql(pql)
          }}
        >
          Submit
        </button>
      </form>
      {
        loading && <Spinner />
      }
      {
        results.error && <span style={{ color: 'red' }}>{results.error}</span>
      }
      <div style={{ padding: 12 }}>
        <h2>Results (Randomized Sample -- Limit 50)</h2>
        <Inspector
          table
          theme="chromeDark"
          data={results.error ? [] : results}
        />
      </div>
    </div>
  )
}

export default NewQueryTool
