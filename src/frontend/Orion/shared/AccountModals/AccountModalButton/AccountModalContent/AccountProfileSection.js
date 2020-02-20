import React from 'react'
import PropTypes from 'prop-types'

import {
  Input,
  Label,
  LabelText,
  SectionTitle,
} from '../styledAccountModalButtonComponents'

import AccountMetaData from './AccountMetaData'

const wrapperStyle = {
  padding: '0 24px',
}

const AccountProfileSection = ({
  additionalFields,
  formState,
  safelySetFormState,
}) => {
  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SectionTitle>Account Info</SectionTitle>
        <AccountMetaData accountId={formState._id} />
      </div>
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
        <LabelText>short name</LabelText>
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
    </div>
  )
}

AccountProfileSection.propTypes = {
  formState: PropTypes.object,
  additionalFields: PropTypes.array,
  safelySetFormState: PropTypes.func,
}

AccountProfileSection.defaultProps = {
  accountType: 'Pathways', // stop create modal breakage
  additionalFields: [],
}

export default AccountProfileSection
