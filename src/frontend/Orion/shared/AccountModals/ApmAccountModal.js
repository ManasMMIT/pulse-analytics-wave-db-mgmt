import React from 'react'

import {
  UPDATE_APM_ORGANIZATION,
  CREATE_APM_ORGANIZATION,
  CREATE_VBM_PARTICIPANT,
  // DELETE_APM_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_APM_ORGANIZATIONS,
  GET_PROVIDER_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
} from '../../../api/queries'

import AccountsModalButton from './AccountsModalButton'

const ApmAccountModal = ({
  account,
  isEditModal,
  buttonLabel,
  buttonStyle,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_APM_ORGANIZATION
    : CREATE_APM_ORGANIZATION

  const refetchQueries = [
    { query: GET_APM_ORGANIZATIONS },
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

export default ApmAccountModal
