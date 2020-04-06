import React, { useState } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import Color from '../../../../utils/color'

import ModalContainer from './ModalContainer'

import {
  ButtonLabel,
} from './styledAccountModalButtonComponents'


const AccountModalButton = ({
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

AccountModalButton.propTypes = {
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

AccountModalButton.defaultProps = {
  account: {},
  additionalFields: [],
  onActionHook: () => {},
}

export default withRouter(AccountModalButton)
