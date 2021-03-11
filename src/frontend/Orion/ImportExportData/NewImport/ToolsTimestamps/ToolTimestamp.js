import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import Button from 'frontend/components/Button'

import { GET_SOURCE_TOOLS } from 'frontend/api/queries'
import { UPDATE_TDG_TIMESTAMPS } from 'frontend/api/mutations'

import Color from '../../../../utils/color'

import Spinner from 'frontend/components/Spinner'

const StyledTd = styled.td({
  padding: '8px 12px',
  fontSize: 12,
  fontWeight: 500,
  verticalAlign: 'middle',
  borderTop: `1px solid ${transparentize(0.92, Color.BLUE)}`,
})

const ToolTimestamp = ({ toolId, toolName, prevTimestamp }) => {
  const isoShortString = prevTimestamp ? prevTimestamp.slice(0, 10) : ''

  const [timestamp, setTimestamp] = useState(isoShortString)

  const [save, { loading }] = useMutation(UPDATE_TDG_TIMESTAMPS, {
    variables: {
      input: {
        _id: toolId,
        tdgTimestamp: timestamp,
      },
    },
    refetchQueries: [{ query: GET_SOURCE_TOOLS }],
  })

  return (
    <tr>
      <StyledTd style={{ padding: '8px 12px 8px 24px' }}>{toolName}</StyledTd>
      <StyledTd>
        <input
          value={timestamp}
          type="date"
          onChange={(e) => setTimestamp(e.target.value)}
          style={{
            padding: 4,
            border: 'none',
            background: transparentize(0.85, Color.BLUE),
            color: Color.BLUE,
            fontWeight: 700,
          }}
        />
      </StyledTd>
      <StyledTd>
        {loading ? (
          <Spinner />
        ) : (
          <Button type="secondary" onClick={save}>
            Update
          </Button>
        )}
      </StyledTd>
    </tr>
  )
}

ToolTimestamp.propTypes = {
  toolId: PropTypes.string,
  toolName: PropTypes.string,
  prevTimestamp: PropTypes.string,
}

ToolTimestamp.defaultProps = {
  toolId: 'Tool missing id field',
  toolName: 'Tool missing name field',
  prevTimestamp: '',
}

export default ToolTimestamp
