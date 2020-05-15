import React, { useState } from "react"
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import Button from 'frontend/components/Button'

import { GET_SOURCE_TOOLS } from 'frontend/api/queries'
import { UPDATE_TDG_TIMESTAMPS } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'

const StyledTd = styled.td({
  padding: '4px 6px',
  verticalAlign: 'middle',
})

const ToolTimestamp = ({ toolId, toolName, prevTimestamp }) => {
  const isoShortString = prevTimestamp ? prevTimestamp.slice(0, 10) : ''

  const [timestamp, setTimestamp] = useState(isoShortString)

  const [save, { loading }] = useMutation(
    UPDATE_TDG_TIMESTAMPS,
    {
      variables: {
        input: {
          _id: toolId,
          tdgTimestamp: timestamp,
        }
      },
      refetchQueries: [{ query: GET_SOURCE_TOOLS }],
    }
  )

  return (
    <tr>
      <StyledTd>{toolName}</StyledTd>
      <StyledTd>
        <input 
          value={timestamp}
          type="date"
          onChange={e => setTimestamp(e.target.value)}
          style={{ padding: 6, border: '1px solid black' }}
        />
      </StyledTd>
      <StyledTd>
        {
          loading 
            ? <Spinner /> 
            : (
              <Button onClick={save}>
                Save
              </Button>
            )
        }
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
