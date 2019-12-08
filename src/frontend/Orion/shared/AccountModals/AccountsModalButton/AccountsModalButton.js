import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'
import { transparentize } from 'polished'

import {
  Spacing,
  Transitions,
  Colors,
} from './../../../../utils/pulseStyles'

import Modal from '../../../../components/Modal'

import ConnectionsSection from './ConnectionsSection'

const ButtonLabel = styled.button({
  border: 'none',
  background: 'none',
  color: '#b6b9bc',
  borderRadius: 4,
  fontWeight: 600,
  cursor: 'pointer',
}, ({ children, ...props}) => ({ ...props })) // not sure why children is here

const Input = styled.input({
  border: 'none',
  borderRadius: 2,
  padding: '0px 12px',
  overflowX: 'scroll',
  margin: '24px 0px',
  minWidth: 200,
  marginTop: 6,
  fontSize: 16,
  ':focus': {
    outline: 'none',
  },
}, props => ({ ...props }))

const Label = styled.label({
  fontSize: 16,
  display: 'flex',
  flexDirection: 'column',
  width: 400,
})

const LabelText = styled.div({
  fontWeight: 500,
})

const SubmitButton = styled.button({
  placeSelf: 'flex-end',
  cursor: 'pointer',
  padding: `${ Spacing.TINY } ${ Spacing.SMALL}`,
  transition: Transitions.NORMAL,
  textTransform: 'capitalize',
  border: 'none',
  borderRadius: 4,
  background: Colors.GREEN,
  color: Colors.WHITE,
  fontWeight: 600,
  fontSize: 12,
  marginLeft: 12,
  ':hover': {
    background: transparentize(0.4, Colors.PRIMARY),
  }
})

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
}) => {
  const { accountId } = queryString.parse(search)

  const shouldModalBeOpenOnLoad = isEditModal
    && accountId === account._id

  const [isOpen, setIsOpen] = useState(shouldModalBeOpenOnLoad)

  const additionalFieldsForState = additionalFields
    .reduce((acc, { key }) => {
      acc[key] = account[key]

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
        setIsOpen(false)
      },
    }
  )

  const submitButton = (
    <SubmitButton onClick={save}>
      {'save & close'}
    </SubmitButton>
  )

  return (
    <>
      <ButtonLabel
        {...buttonStyle}
        onClick={() => {
          history.push({
            search: isEditModal ? `?accountId=${ account._id }` : ''
          })

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
        title={`Account ${ isEditModal ? 'Edit' : 'Create' }`}
        submitButton={submitButton}
        show={isOpen}
        handleClose={() => {
          history.push({
            search: ''
          })

          setIsOpen(false)
        }}
      >
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
                  safelySetSubmitState({
                    [key]: e.target.value
                  })
                }}
              />
            </Label>
          ))
        }
        <ConnectionsSection
          from={account}
          connections={account.connections}
          vbmConnectionDoc={vbmConnectionDoc}
          refetchQueries={refetchQueries}
          isEditModal={isEditModal}
        />
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
