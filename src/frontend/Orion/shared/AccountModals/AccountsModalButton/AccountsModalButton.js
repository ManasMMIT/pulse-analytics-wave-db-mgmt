import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import ModalContainer from './ModalContainer'

import {
  ButtonLabel,
} from './styledAccountModalButtonComponents'

const AccountsModalButton = ({
  buttonLabel,
  buttonStyle,
  account, // ! needs to have at least _id and type
  history,
  location: { search },
  saveMutationDoc,
  refetchQueries,
  additionalFields,
  isEditModal,
  onActionHook,
}) => {
  const {
    accountId,
    ...restOfQueryString
  } = queryString.parse(search || {})

  const shouldModalBeOpenOnLoad = (
    isEditModal && accountId === account._id
  )

  const [isOpen, setIsOpen] = useState(shouldModalBeOpenOnLoad)

  return (
    <>
      <ButtonLabel
        {...buttonStyle}
        onClick={() => {
          const search = isEditModal
            ? queryString.stringify({ ...restOfQueryString, accountId: account._id })
            : {}

          isEditModal && history.push({ search })

          setIsOpen(true)
        }}
      >
        {buttonLabel}
      </ButtonLabel>
      {
        isOpen && (
          <ModalContainer
            accountId={account._id}
            accountType={account.type}
            saveMutationDoc={saveMutationDoc}
            refetchQueries={refetchQueries}
            onActionHook={onActionHook}
            additionalFields={additionalFields}
            isEditModal={isEditModal}
            setIsOpen={setIsOpen}
            restOfQueryString={restOfQueryString}
          />
        )
      }
    </>
  )
}

AccountsModalButton.propTypes = {
  buttonLabel: PropTypes.any,
  buttonStyle: PropTypes.object,
  account: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  saveMutationDoc: PropTypes.object,
  refetchQueries: PropTypes.array,
  additionalFields: PropTypes.array,
  isEditModal: PropTypes.bool,
  onActionHook: PropTypes.func,
}

AccountsModalButton.defaultProps = {
  account: {},
  additionalFields: [],
  onActionHook: () => {},
}

export default withRouter(AccountsModalButton)
