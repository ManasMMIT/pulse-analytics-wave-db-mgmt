import React from 'react'

import { GET_AQUILA_PQL_RESULTS } from 'frontend/api/queries'
import usePql from '../../../hooks/usePql'
import { Colors } from '../../../utils/pulseStyles'

import QueryToolTable from './QueryToolTable'

const PqlView = () => {
  const {
    setPql,
    data: { pql, results },
    loading,
    submitPql,
  } = usePql()

  const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')

  return (
    <>
      <form style={{ margin: 12, boxSizing: 'border-box' }}>
        <input
          style={{ width: '94%', height: 20, padding: 12, background: Colors.WHITE, border: '1px solid black' }}
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
        results.error && <span style={{ color: 'red' }}>{results.error}</span>
      }
      <QueryToolTable
        data={results}
        loading={loading}
        businessObjectName={businessObjectName}
        refetchQueries={[{ query: GET_AQUILA_PQL_RESULTS, variables: { pql } }]}
      />
    </>
  )
}

export default PqlView
