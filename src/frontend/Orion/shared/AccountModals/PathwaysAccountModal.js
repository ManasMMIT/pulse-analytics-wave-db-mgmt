import React from 'react'

import {
  UPDATE_PATHWAYS_ORGANIZATION,
  CREATE_PATHWAYS_ORGANIZATION,
  // DELETE_PATHWAYS_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_PATHWAYS_ORGANIZATIONS,
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

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={[{ query: GET_PATHWAYS_ORGANIZATIONS }]}
      isEditModal={isEditModal}
    />
  )
}

export default PathwaysAccountModal
