import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useMutation } from '@apollo/react-hooks'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import {
  Colors,
} from './../../../../utils/pulseStyles'

import Modal from '../../../../components/Modal'

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
  padding: '8px 12px',
  transition: '250ms ease',
  borderRadius: 4,
  background: Colors.GREEN,
  color: Colors.WHITE,
  fontWeight: 700,
})

const AccountsModalButton = ({
  buttonLabel,
  buttonStyle,
  account,
  history,
  location: { search },
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

  const resetState = () => setSubmitState(initialSubmitState)
  const persistSubmitState = () => setSubmitState(submitState)

  const [save] = useMutation(
    saveMutationDoc,
    {
      variables: { input: submitState },
      refetchQueries,
      update: () => {
        persistSubmitState()
        setIsOpen(false)
      },
    }
  )

  return (
    <>
      <ButtonLabel
        {...buttonStyle}
        onClick={() => {
          history.push({
            search: isEditModal ? `?accountId=${ account._id }` : ''
          })

          setIsOpen(true)
        }}
      >
        {buttonLabel}
      </ButtonLabel>
      <Modal
        title={`Account ${ isEditModal ? 'Edit' : 'Create' }`}
        show={isOpen}
        handleClose={() => {
          history.push({
            search: ''
          })

          resetState()
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
        <SubmitButton onClick={save}>
          submit
        </SubmitButton>
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
