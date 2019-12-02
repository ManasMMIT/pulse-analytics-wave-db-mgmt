import React from 'react'

import {
  UPDATE_PAYER_ORGANIZATION,
  CREATE_PAYER_ORGANIZATION,
  // DELETE_PAYER_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_PAYER_ORGANIZATIONS,
} from '../../../api/queries'

import AccountsModalButton from './AccountsModalButton'

const PayerAccountModal = ({
  account,
  isEditModal,
  buttonLabel,
  buttonStyle,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_PAYER_ORGANIZATION
    : CREATE_PAYER_ORGANIZATION

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={[{ query: GET_PAYER_ORGANIZATIONS }]}
      isEditModal={isEditModal}
    />
  )
}

export default PayerAccountModal
