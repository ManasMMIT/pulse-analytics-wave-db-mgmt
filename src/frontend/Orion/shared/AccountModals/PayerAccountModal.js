import React from 'react'

import {
  UPDATE_PAYER_ORGANIZATION,
  CREATE_PAYER_ORGANIZATION,
  CREATE_VBM_PARTICIPATION,
  // DELETE_PAYER_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from '../../../api/queries'

import AccountsModalButton from './AccountsModalButton'

const PayerAccountModal = ({
  account,
  isEditModal,
  buttonLabel,
  buttonStyle,
  onActionHook,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_PAYER_ORGANIZATION
    : CREATE_PAYER_ORGANIZATION

  const refetchQueries = [
    { query: GET_PAYER_ORGANIZATIONS },
    { query: GET_PATHWAYS_ORGANIZATIONS },
    { query: GET_APM_ORGANIZATIONS },
  ]

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      vbmConnectionDoc={CREATE_VBM_PARTICIPATION}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={refetchQueries}
      isEditModal={isEditModal}
      onActionHook={onActionHook}
    />
  )
}

export default PayerAccountModal
