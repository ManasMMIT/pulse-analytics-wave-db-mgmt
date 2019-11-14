import React from 'react'
import PropTypes from 'prop-types'

import { ALL_EMAIL_SUBSCRIPTIONS } from '../../../utils/email-subscription-options'

const EmailSubscriptions = ({
  emailSubscriptions,
  handleChange,
}) => {
  return (
    <>
      {
        ALL_EMAIL_SUBSCRIPTIONS.map(({ type, _id }) => (
          <div key={_id}>
            <input
              type='checkbox'
              id={_id}
              checked={Boolean(
                emailSubscriptions.find(subscriptionId => {
                  return _id === subscriptionId
                })
              )}
              onChange={() => handleChange(_id)}
            />
            <label style={{ paddingLeft: 8 }}>{type}</label>
          </div>
        ))
      }
    </>
  )
}

EmailSubscriptions.propTypes = {
  emailSubscriptions: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func,
}

EmailSubscriptions.defaultProps = {
  emailSubscriptions: [],
  handleChange: null,
}

export default EmailSubscriptions
