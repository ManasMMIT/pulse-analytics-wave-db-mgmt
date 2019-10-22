import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import format from 'date-fns/format'

import Spinner from '../Phoenix/shared/Spinner'
import Card from '../components/Card'

import { EMAIL_ALERTS } from '../api/mutations'

const ButtonsWrapper = styled.section({
  display: 'flex',
  justifyContent:' space-evenly',
})

const CodeSnippet = styled.code({
  background: 'gray',
  padding: 4,
  borderRadius: 4,
  color: 'white',
})

const ListItem = styled.li({
  paddingBottom: 24,
})

const EmailAlerts = () => {
  const [emailAlerts, { loading }] = useMutation(EMAIL_ALERTS)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM'))

  if (loading) return <Spinner />

  const handleSubmit = templateType => {
    emailAlerts({
      variables: {
        input: {
          templateType,
          date,
        }
      }
    })
  }
   
  return (
    <Card title={'Pathways Email'}>
      <h2 style={{ marginBlockStart: 0 }}>Follow instructions to send pathways email:</h2>
      <section>
        <ol>
          <ListItem>
            Run <CodeSnippet>node ./prepEmailAlertsData</CodeSnippet> in wave-db-mgmt
          </ListItem>
          <ListItem>
            Verify the appropriate emails are in the <CodeSnippet>temp.users</CodeSnippet> collection
            <br/>
              <a href='https://dedhamgroup.atlassian.net/wiki/spaces/POL/pages/697237509/Delphi+email+service'>See docs.</a>
          </ListItem>
          <ListItem>
            Filter alerts by month:  <input type="month" value={date} onChange={e => setDate(e.target.value)} /> 
          </ListItem>
        </ol>
      </section>
      <ButtonsWrapper>
        <button onClick={() => handleSubmit('test')}>Send Internal Test Email</button>
        <button onClick={() => handleSubmit('pathwaysAlerts')}>Send Pathways Email</button>
      </ButtonsWrapper>
    </Card>
  )
}

export default EmailAlerts