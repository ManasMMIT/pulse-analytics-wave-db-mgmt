import React from 'react'

import SendButton from '../../shared/SendButton'
import UsersTable from './UsersTable'
import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'

import {
  SEND_TO_SUBSCRIBED_USERS
} from './../../../api/mutations'

const PathwaysEmailCard = () => {
  return (
    <div style={{ padding: 24, border: '1px solid black' }}>
      <label>Pathways Email</label>

      <div style={{ marginTop: 24 }}>
        <SendButton
          data={{
            input: {
              _id: pathwaysEmailSubscription._id,
            }
          }}
          mutationDoc={SEND_TO_SUBSCRIBED_USERS}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <UsersTable />
      </div>
    </div>
  )
}

export default PathwaysEmailCard
