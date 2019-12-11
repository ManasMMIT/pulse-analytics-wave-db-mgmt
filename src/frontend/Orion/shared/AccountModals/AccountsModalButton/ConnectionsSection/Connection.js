import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import {
  DELETE_VBM_CONNECTION,
} from './../../../../../api/mutations'

import {
  ConnectionCard,
  ConnectionCategory,
  ConnectionCategoryLabel,
  RemoveConnectionButton,
  ConnectionLanguage,
  ConnectionAccount,
  ConnectionText,
  ConnectionTypeTag,
} from './styledConnectionComponents'

const Connection = ({
  from,
  to,
  refetchQueries,
  onActionHook,
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
    onCompleted: onActionHook
  })

  const displayState = state ? `(${state}) ` : ''

  // `${ from.organization } ${ displayState }participates in ${ toOrg } (${ toType }).`

  const language = from.type === 'Payer' || from.type === 'Provider'
    ? (
      <div>
        <ConnectionAccount>{ toOrg } </ConnectionAccount>
        <ConnectionTypeTag>{ toType }</ConnectionTypeTag>
        <ConnectionText> is affiliated with </ConnectionText>
        <ConnectionAccount>{ from.organization } { displayState }</ConnectionAccount>
      </div>
    ) : (
      <div>
        <ConnectionAccount>{ toOrg } { displayState }</ConnectionAccount>
        <ConnectionText><ConnectionTypeTag>{ toType }</ConnectionTypeTag> participates in </ConnectionText>
        <ConnectionAccount>{ from.organization }</ConnectionAccount>
      </div>
    )

  return (
    <ConnectionCard>
      <ConnectionCategory>
        <ConnectionCategoryLabel>{category}</ConnectionCategoryLabel>
        <ConnectionLanguage>{ language } </ConnectionLanguage>
      </ConnectionCategory>
      <RemoveConnectionButton
        onClick={deleteVbmConnection}
      >
        ×
      </RemoveConnectionButton>
    </ConnectionCard>
  )
}

export default Connection
