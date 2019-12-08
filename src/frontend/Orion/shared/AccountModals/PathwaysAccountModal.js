import React from 'react'

import {
  UPDATE_PATHWAYS_ORGANIZATION,
  CREATE_PATHWAYS_ORGANIZATION,
  // DELETE_PATHWAYS_ORGANIZATION,
  CREATE_VBM_PARTICIPANT,
} from '../../../api/mutations'

import {
  GET_PATHWAYS_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
} from '../../../api/queries'

import AccountsModalButton from './AccountsModalButton'

const PathwaysAccountModal = ({
  account,
  isEditModal,
  buttonLabel,
  buttonStyle,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_PATHWAYS_ORGANIZATION
    : CREATE_PATHWAYS_ORGANIZATION

  const refetchQueries = [
    { query: GET_PATHWAYS_ORGANIZATIONS },
    { query: GET_PROVIDER_ORGANIZATIONS },
    { query: GET_PAYER_ORGANIZATIONS },
  ]

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      vbmConnectionDoc={CREATE_VBM_PARTICIPANT}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={refetchQueries}
      isEditModal={isEditModal}
    />
  )
}

export default PathwaysAccountModal
