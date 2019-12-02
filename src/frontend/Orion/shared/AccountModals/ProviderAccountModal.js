import React from 'react'

import {
  UPDATE_PROVIDER_ORGANIZATION,
  CREATE_PROVIDER_ORGANIZATION,
  // DELETE_PROVIDER_ORGANIZATION,
} from '../../../api/mutations'

import {
  GET_PROVIDER_ORGANIZATIONS,
} from '../../../api/queries'

import AccountsModalButton from './AccountsModalButton'

const ADDITIONAL_FIELDS = [
  { label: 'cancer center', key: 'providerCancerCenter' }
]

const ProviderAccountModal = ({
  account,
  isEditModal,
  buttonLabel,
  buttonStyle,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_PROVIDER_ORGANIZATION
    : CREATE_PROVIDER_ORGANIZATION

  return (
    <AccountsModalButton
      account={account}
      buttonLabel={buttonLabel}
      buttonStyle={buttonStyle}
      saveMutationDoc={saveMutationDoc}
      refetchQueries={[{ query: GET_PROVIDER_ORGANIZATIONS }]}
      additionalFields={ADDITIONAL_FIELDS}
      isEditModal={isEditModal}
    />
  )
}

export default ProviderAccountModal
