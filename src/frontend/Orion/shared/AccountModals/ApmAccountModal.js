import React from 'react'

import {
  UPDATE_APM_ORGANIZATION,
  CREATE_APM_ORGANIZATION,
  // DELETE_APM_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_APM_ORGANIZATIONS,
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

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={[{ query: GET_APM_ORGANIZATIONS }]}
      isEditModal={isEditModal}
    />
  )
}

export default ApmAccountModal
