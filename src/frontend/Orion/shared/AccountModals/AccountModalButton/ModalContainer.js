import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useQuery, useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import Modal from '../../../../components/Modal'
import AccountModalContent from './AccountModalContent'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
  GET_ORGANIZATION_META,
} from '../../../../api/queries'

import {
  UPSERT_ORGANIZATION_META,
} from '../../../../api/mutations'

import {
  SubmitButton,
} from './styledAccountModalButtonComponents'
import Spinner from '../../../../Phoenix/shared/Spinner'

const ORG_TYPE_QUERY_MAP = {
  'Pathways': GET_PATHWAYS_ORGANIZATIONS,
  'Provider': GET_PROVIDER_ORGANIZATIONS,
  'Alternative Payment Model': GET_APM_ORGANIZATIONS,
  'Payer': GET_PAYER_ORGANIZATIONS
}

const ModalContainer = ({
  accountId,
  accountType,
  saveMutationDoc,
  refetchQueries,
  onActionHook,
  additionalFields,
  isEditModal,
  history,
  setIsOpen,
  restOfQueryString,
}) => {
  const {
    data,
    loading: isAccountLoading,
  } = useQuery(ORG_TYPE_QUERY_MAP[accountType])

  const [formState, setFormState] = useState({})
  const [shouldShow, setShouldShow] = useState(false)
  const [allAccounts, setAllAccounts] = useState([])

  useEffect(() => {
    if (!isAccountLoading) {
      const accounts = Object.values(data)[0]

      const account = _.cloneDeep( // needed to prevent mutating account in cache
        accounts.find(({ _id }) => _id === accountId)
      ) || {}

      delete account.__typename

      const additionalFieldsForState = additionalFields
        .reduce((acc, { key, type }) => {
          acc[key] = type === 'number'
            ? parseInt(account[key])
            : account[key]

          return acc
        }, {})

      const initialFormState = {
        ...account,
        ...additionalFieldsForState,
      }

      setFormState(initialFormState)
      setShouldShow(true)
      setAllAccounts(accounts)
    }
  }, [isAccountLoading])

  const [
    writeMetaData,
    {
      loading: isWritingMetaData,
    }
  ] = useMutation(UPSERT_ORGANIZATION_META, {
    variables: {
      input: {
        action: 'update',
        _ids: [accountId],
      }
    }
  })

  const writeMetaDataRefetchQueries = [
    // refetch across all orgs of this type to make sure
    // the CSV export side's query for meta data is retriggered
    // (even tho you've only updated on account)
    {
      query: GET_ORGANIZATION_META,
      variables: { _ids: allAccounts.map(({ _id }) => _id) }
    },
  ]

  // ! Note: refetching for a single account doesn't appear needed (the bigger refetch above covers this case)
  // ! but we don't understand why
  if (accountId) {
    // refetch single org's meta data to refresh cache for the header
    // of the targeted account's modal
    writeMetaDataRefetchQueries.push({
      query: GET_ORGANIZATION_META,
      variables: { _ids: [accountId] }
    })
  }

  const [save, { loading }] = useMutation(
    saveMutationDoc,
    {
      variables: { input: formState },
      refetchQueries,
      onCompleted: async () => {
        await writeMetaData({ refetchQueries: writeMetaDataRefetchQueries })

        const search = queryString.stringify(restOfQueryString)
        history.push({ search })

        setIsOpen(false)

        onActionHook()
      },
      awaitRefetchQueries: isEditModal,
    }
  )

  if (isAccountLoading || !shouldShow) return null

  const submitButton = loading || isWritingMetaData
    ? (
      <SubmitButton>
        <Spinner />
      </SubmitButton>
    ) : (
      <SubmitButton onClick={save}>
        {'save + close'}
      </SubmitButton>
    )

  const safelySetFormState = newState => {
    setFormState({
      ...formState,
      ...newState,
    })
  }
  return (
    <Modal
      show
      noClickAway
      title={`${isEditModal ? accountType : ''} Account ${isEditModal ? 'Edit' : 'Create'}`}
      submitButton={submitButton}
      handleClose={() => {
        const search = queryString.stringify(restOfQueryString)
        history.push({ search })

        setIsOpen(false)
      }}
    >
      <AccountModalContent
        accountId={accountId}
        additionalFields={additionalFields}
        formState={formState}
        isEditModal={isEditModal}
        safelySetFormState={safelySetFormState}
      />
    </Modal>
  )
}

ModalContainer.propTypes = {
  accountId: PropTypes.string,
  accountType: PropTypes.string,
  saveMutationDoc: PropTypes.object,
  refetchQueries: PropTypes.array,
  onActionHook: PropTypes.func,
  additionalFields: PropTypes.array,
  isEditModal: PropTypes.bool,
  history: PropTypes.object,
  setIsOpen: PropTypes.bool,
  restOfQueryString: PropTypes.string,
}

ModalContainer.defaultProps = {
  accountType: 'Pathways',
  additionalFields: [],
}

export default withRouter(ModalContainer)
