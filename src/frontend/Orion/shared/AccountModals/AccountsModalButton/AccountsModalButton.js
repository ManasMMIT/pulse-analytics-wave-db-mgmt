import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import Modal from '../../../../components/Modal'

import ConnectionsSection from './ConnectionsSection'

import {
  ButtonLabel,
  Input,
  Label,
  LabelText,
  SubmitButton,
  SectionTitle,
} from './styledAccountModalButtonComponents'

const AccountsModalButton = ({
  buttonLabel,
  buttonStyle,
  account,
  history,
  location: { search },
  vbmConnectionDoc,
  saveMutationDoc,
  refetchQueries,
  additionalFields,
  isEditModal,
  onActionHook,
}) => {
  const {
    accountId,
    ...restOfQueryString
  } = queryString.parse(search)

  const shouldModalBeOpenOnLoad = isEditModal
    && accountId === account._id

  const [isOpen, setIsOpen] = useState(shouldModalBeOpenOnLoad)

  const additionalFieldsForState = additionalFields
    .reduce((acc, { key, type }) => {
      acc[key] = type === 'number'
        ? parseInt(account[key])
        : account[key]

      return acc
    }, {})

  const initialSubmitState = {
    _id: account._id ,
    organization: account.organization,
    organizationTiny: account.organizationTiny,
    slug: account.slug,
    ...additionalFieldsForState,
  }

  const [submitState, setSubmitState] = useState(initialSubmitState)

  const safelySetSubmitState = newState => {
    setSubmitState({
      ...submitState,
      ...newState,
    })
  }

  const [save] = useMutation(
    saveMutationDoc,
    {
      variables: { input: submitState },
      refetchQueries,
      update: () => {
        const search = queryString.stringify(restOfQueryString)
        history.push({ search })
        setIsOpen(false)
      },
      onCompleted: onActionHook,
    }
  )

  const submitButton = (
    <SubmitButton onClick={save}>
      {'save + close'}
    </SubmitButton>
  )

  return (
    <>
      <ButtonLabel
        {...buttonStyle}
        onClick={() => {
          const search = isEditModal
            ? queryString.stringify({ ...restOfQueryString, accountId: account._id })
            : {}

          isEditModal && history.push({ search })

          setSubmitState({
            _id: account._id,
            organization: account.organization,
            organizationTiny: account.organizationTiny,
            slug: account.slug,
            ...additionalFieldsForState,
          })

          setIsOpen(true)
        }}
      >
        {buttonLabel}
      </ButtonLabel>
      <Modal
        title={`${isEditModal ? account.type : '' } Account ${ isEditModal ? 'Edit' : 'Create' }`}
        submitButton={submitButton}
        show={isOpen}
        handleClose={() => {

          const search = queryString.stringify(restOfQueryString)
          history.push({ search })

          setIsOpen(false)
        }}
      >
        <SectionTitle>Account Info</SectionTitle>
        <Label>
          <LabelText>name</LabelText>
          <Input
            autoFocus
            type="text"
            value={submitState.organization}
            onChange={e => {
              safelySetSubmitState({
                organization: e.target.value
              })
            }}
          />
        </Label>
        <Label>
          <LabelText>alias</LabelText>
          <Input
            type="text"
            value={submitState.organizationTiny}
            onChange={e => {
              safelySetSubmitState({
                organizationTiny: e.target.value
              })
            }}
          />
        </Label>
        <Label>
          <LabelText>slug</LabelText>
          <Input
            type="text"
            value={submitState.slug}
            onChange={e => {
              safelySetSubmitState({
                slug: e.target.value
              })
            }}
          />
        </Label>
        {
          additionalFields.map(({ label, key, type }) => (
            <Label key={label}>
              <LabelText>{label}</LabelText>
              <Input
                type={type || "text"}
                value={submitState[key]}
                onChange={e => {
                  const value = type === 'number'
                    ? parseInt(e.target.value)
                    : e.target.value

                  safelySetSubmitState({
                    [key]: value
                  })
                }}
              />
            </Label>
          ))
        }
        {/*
            We can't rely on account.connections in ConnectionsSection,
              because the passed-in account may not always have the full
              set of connections -- e.g., in the query tool, we only return
              relevant connections, but the account modal needs to see all connections.

            This decision was made to make the accounts modal more reusable,
              independent of where it lives in the frontend.
        */}
        {
          !_.isEmpty(account) && (
            <ConnectionsSection
              from={account}
              onActionHook={onActionHook}
              vbmConnectionDoc={vbmConnectionDoc}
              refetchQueries={refetchQueries}
              isEditModal={isEditModal}
            />
          )
        }
      </Modal>
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
}

AccountsModalButton.defaultProps = {
  account: {},
  additionalFields: [],
}

export default withRouter(AccountsModalButton)
