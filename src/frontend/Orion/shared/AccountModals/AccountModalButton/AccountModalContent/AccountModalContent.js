import React from 'react'
import PropTypes from 'prop-types'

import AccountProfileSection from './AccountProfileSection'
import ConnectionsSection from './ConnectionsSection'

const AccountsModalContent = ({
  additionalFields,
  formState,
  isEditModal,
  safelySetFormState,
}) => {
  return (
    <div style={{ display: 'flex', padding: '12px 0px' }}>
      <AccountProfileSection
        formState={formState}
        additionalFields={additionalFields}
        safelySetFormState={safelySetFormState}
      />
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

export default AccountsModalContent
