import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useQuery, useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import Modal from '../../../../components/Modal'
import AccountsModalContent from './AccountsModalContent'

import {
  GET_PROVIDER_ORGANIZATIONS,
  GET_PAYER_ORGANIZATIONS,
  GET_PATHWAYS_ORGANIZATIONS,
  GET_APM_ORGANIZATIONS,
} from './../../../../api/queries'

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
    }
  }, [isAccountLoading])

  const [save, { loading }] = useMutation(
    saveMutationDoc,
    {
      variables: { input: formState },
      refetchQueries,
      onCompleted: () => {
        const search = queryString.stringify(restOfQueryString)
        history.push({ search })

        setIsOpen(false)

        onActionHook()
      },
      awaitRefetchQueries: isEditModal,
    }
  )

  if (isAccountLoading || !shouldShow) return null

  const submitButton = loading
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
      title={`${isEditModal ? accountType : ''} Account ${isEditModal ? 'Edit' : 'Create'}`}
      submitButton={submitButton}
      handleClose={() => {
        const search = queryString.stringify(restOfQueryString)
        history.push({ search })

        setIsOpen(false)
      }}
    >
      <AccountsModalContent
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
