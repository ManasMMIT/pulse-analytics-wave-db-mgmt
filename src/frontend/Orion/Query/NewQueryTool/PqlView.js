import React from 'react'
import { Link } from 'react-router-dom'
import Inspector from 'react-inspector'
import styled from '@emotion/styled'

import Spinner from 'frontend/components/Spinner'

import Spacing from '../../../utils/spacing'
import FontSpace from '../../../utils/fontspace'
import Color from '../../../utils/color'
import useAquila from '../../../hooks/useAquila'
import { Colors } from '../../../utils/pulseStyles'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
})

const PqlView = () => {
  const {
    setPql,
    data: { pql, results },
    loading,
    submitPql,
  } = useAquila()

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ padding: Spacing.S4, ...FontSpace.FS4 }}>Query Tool</h1>
        <Link style={{ fontWeight: 700, padding: 12, background: 'blue', color: 'white', borderRadius: 4 }} to="/orion/query/tool/placard">Placard View</Link>
      </div>
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
    </Wrapper>
  )
}

export default PqlView
