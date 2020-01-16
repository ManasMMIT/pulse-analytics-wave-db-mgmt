import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { withRouter } from 'react-router-dom'

import ConnectionsSection from './ConnectionsSection'

import {
  Input,
  Label,
  LabelText,
  SectionTitle,
} from './styledAccountModalButtonComponents'

const AccountsModalContent = ({
  additionalFields,
  formState,
  isEditModal,
  safelySetFormState,
}) => {
  return (
    <div>
      <SectionTitle>Account Info</SectionTitle>
      <Label>
        <LabelText>name</LabelText>
        <Input
          autoFocus
          type="text"
          value={formState.organization}
          onChange={e => {
            safelySetFormState({
              organization: e.target.value
            })
          }}
        />
      </Label>
      <Label>
        <LabelText>alias</LabelText>
        <Input
          type="text"
          value={formState.organizationTiny}
          onChange={e => {
            safelySetFormState({
              organizationTiny: e.target.value
            })
          }}
        />
      </Label>
      <Label>
        <LabelText>slug</LabelText>
        <Input
          type="text"
          value={formState.slug}
          onChange={e => {
            safelySetFormState({
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
              value={formState[key]}
              onChange={e => {
                const value = type === 'number'
                  ? parseInt(e.target.value)
                  : e.target.value

                safelySetFormState({
                  [key]: value
                })
              }}
            />
          </Label>
        ))
      }
      {
        isEditModal && (
          <ConnectionsSection
            from={formState}
            safelySetFormState={safelySetFormState}
          />
        )
      }
    </div>
  )
}

AccountsModalContent.propTypes = {
  formState: PropTypes.object,
  additionalFields: PropTypes.array,
  isEditModal: PropTypes.bool,
  safelySetFormState: PropTypes.func,
}

AccountsModalContent.defaultProps = {
  accountType: 'Pathways', // stop create modal breakage
  additionalFields: [],
}

export default withRouter(AccountsModalContent)
