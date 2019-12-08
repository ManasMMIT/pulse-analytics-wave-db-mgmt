import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  DELETE_VBM_CONNECTION,
} from './../../../../../api/mutations'

import { Colors } from '../../../../../utils/pulseStyles'

const Wrapper = styled.div({
  padding: 12,
  fontSize: 14,
  color: Colors.PRIMARY,
  background: Colors.WHITE,
  borderRadius: 4,
  margin: '12px 0px',
  fontWeight: 500,
})

const ConnectionCategory = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: Colors.MEDIUM_GRAY_2,
  fontSize: 12,
  paddingBottom: 12,
  fontWeight: 100,
})

const Connection = ({
  from,
  to,
  refetchQueries,
}) => {
  const {
    org: {
      organization: toOrg,
      type: toType,
    },
    state,
    category,
  } = to

  const [deleteVbmConnection] = useMutation(DELETE_VBM_CONNECTION, {
    variables: {
      input: { _id: to._id }
    },
    refetchQueries,
  })

  const displayState = state ? `(${state}) ` : ''

  const language = from.type === 'Payer' || from.type === 'Provider'
    ? `${ from.organization } ${ displayState }participates in ${ toOrg } (${ toType }).`
    : `${toOrg} ${ displayState }(${ toType }) is a participant of ${ from.organization }.`

  return (
    <Wrapper>
      <ConnectionCategory>
        <div>{category}</div>
        <button
          onClick={deleteVbmConnection}
        >
          X
        </button>
      </ConnectionCategory>
      <span>{ language } </span>
    </Wrapper>
  )
}

export default Connection