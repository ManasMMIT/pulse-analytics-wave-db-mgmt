import React from 'react'
import { Mutation } from 'react-apollo'

import Spinner from '../Phoenix/shared/Spinner'

import { EMAIL_ALERTS } from '../api/mutations'

const Email = () => (
  <Mutation
    mutation={EMAIL_ALERTS}
  >
  {(emailAlerts, { loading, error }) => {
    if (loading) return <Spinner/>

    // add error alert

    const handleSubmit = () => {
      emailAlerts({
        variables: {
          input: {
            templateType: 'pathwaysAlerts',
            emailList: ['claire.kim@dedhamgroup.com'],
          }
        }
      })
    }

    return (
      <>
        <div style={{ marginTop: 24 }}>
          <button onClick={handleSubmit}>Email</button>
        </div>
      </>
    )
  }}
</Mutation>
)

export default Email