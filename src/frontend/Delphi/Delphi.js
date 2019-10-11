import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import Spinner from '../Phoenix/shared/Spinner'

import { EMAIL_ALERTS } from '../api/mutations'

const CodeSnippet = styled.code({
  background: 'gray',
  padding: 4,
  borderRadius: 4,
  color: 'white',
})

const Delphi = () => {
  const [emailAlerts, { loading, error }] = useMutation(EMAIL_ALERTS)

  if (loading) return <Spinner />

  const handleSubmit = templateType => {
    emailAlerts({
      variables: {
        input: {
          templateType,
        }
      }
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Follow instructions to send pathways email:</h2>
      <section>
        <ol>
          <li style={{ paddingBottom: 24 }}>
            Run <CodeSnippet>node ./prepEmailAlertsData</CodeSnippet> in wave-db-mgmt
          </li>
          <li style={{ paddingBottom: 24 }}>
            Verify the appropriate emails are in the <CodeSnippet>temp.users</CodeSnippet> collection
            <br/>
              <a href='https://dedhamgroup.atlassian.net/wiki/spaces/POL/pages/697237509/Delphi+email+service'>See docs.</a>
          </li>
          <li>
            <button onClick={() => handleSubmit('test')}>Send Internal Test Email</button>
            <span style={{padding: 24}}/>
            <button onClick={() => handleSubmit('pathwaysAlerts')}>Send Pathways Email</button>
          </li>
        </ol>
      </section>
    </div>
  )
}

export default Delphi
