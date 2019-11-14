import React from 'react'
import gql from 'graphql-tag'

import SendButton from '../../shared/SendButton'
import UsersTable from './UsersTable'
import { pathwaysEmailSubscription } from '../../../utils/email-subscription-options'

const DUMMY_MUTATION = gql`
  mutation asdf($input: asdf!) {
    asdf(input: $input) {
      blah
    }
  }
`

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
          mutationDoc={DUMMY_MUTATION}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <UsersTable />
      </div>
    </div>
  )
}

export default PathwaysEmailCard
