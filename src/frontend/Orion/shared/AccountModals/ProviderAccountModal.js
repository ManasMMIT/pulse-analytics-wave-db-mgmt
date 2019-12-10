import React from 'react'

import {
  UPDATE_PROVIDER_ORGANIZATION,
  CREATE_PROVIDER_ORGANIZATION,
  // DELETE_PROVIDER_ORGANIZATION,
  CREATE_VBM_PARTICIPATION,
} from '../../../api/mutations'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
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
  onActionHook,
}) => {
  const saveMutationDoc = isEditModal
    ? UPDATE_PROVIDER_ORGANIZATION
    : CREATE_PROVIDER_ORGANIZATION

  const refetchQueries = [
    { query: GET_PROVIDER_ORGANIZATIONS },
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
      additionalFields={ADDITIONAL_FIELDS}
      isEditModal={isEditModal}
      onActionHook={onActionHook}
    />
  )
}

export default ProviderAccountModal
