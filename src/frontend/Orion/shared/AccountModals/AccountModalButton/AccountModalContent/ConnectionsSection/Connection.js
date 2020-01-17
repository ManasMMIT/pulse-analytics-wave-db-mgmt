import React from 'react'

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
  data,
  removeConnection,
}) => {
  const {
    org: {
      organization: dataOrg,
      type: dataType,
    },
    state,
    category,
  } = data

  const displayState = state ? `(${state}) ` : ''

  // `${ from.organization } ${ displayState }participates in ${ dataOrg } (${ dataType }).`

  const language = from.type === 'Payer' || from.type === 'Provider'
    ? (
      <div>
        <ConnectionAccount>{ dataOrg } </ConnectionAccount>
        <ConnectionTypeTag>{ dataType }</ConnectionTypeTag>
        <ConnectionText> is affiliated with </ConnectionText>
        <ConnectionAccount>{ from.organization } { displayState }</ConnectionAccount>
      </div>
    ) : (
      <div>
        <ConnectionAccount>{ dataOrg } { displayState }</ConnectionAccount>
        <ConnectionText><ConnectionTypeTag>{ dataType }</ConnectionTypeTag> participates in </ConnectionText>
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
        onClick={() => removeConnection(data)}
      >
        ×
      </RemoveConnectionButton>
    </ConnectionCard>
  )
}

export default Connection
