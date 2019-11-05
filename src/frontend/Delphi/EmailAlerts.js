import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import format from 'date-fns/format'
import { darken, lighten, transparentize } from 'polished'

import Spinner from '../Phoenix/shared/Spinner'
import Card from '../components/Card'

import { EMAIL_ALERTS } from '../api/mutations'

const ButtonsWrapper = styled.section({
  display: 'flex',
  justifyContent: 'space-evenly',
})

const primaryButtonColor = '#0668D9'
const secondaryButtonColor = '#CDD8E6'
const blackColor = '#0A2E4D'

const Button = styled.button({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 'bold',
  padding: '12px 16px',
  transition: '250ms ease',
  ':active': {
    boxShadow: `0 1px 16px 1px ${transparentize(0.9, blackColor)}`,
  },
  ':focus': {
    outline: 'none',
    boxShadow: `0 1px 16px 1px ${transparentize(0.9, blackColor)}`
  }
}, props => ({
  background: props.secondary ? secondaryButtonColor : primaryButtonColor,
  color: props.secondary ? transparentize(0.5, blackColor) : '#FFF',
  ':hover': {
    background: props.secondary ? darken(0.1, secondaryButtonColor) : lighten(0.1, primaryButtonColor),
    boxShadow: `0 4px 16px 1px ${transparentize(0.75, blackColor)}`
  },
}))

const CodeSnippet = styled.code({
  background: '#EDF1F5',
  fontSize: 13,
  padding: 4,
  borderRadius: 4,
})

const ListItem = styled.li({
  paddingBottom: 24,
  fontSize: 16,
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
        },
      },
    })
  }

  return (
    <Card title={'Pathways Email'}>
      <h4 style={{ marginBlockStart: 0 }}>
        Follow these instructions to send the pathways monthly email:
      </h4>
      <section>
        <ol>
          <ListItem>
            Run <CodeSnippet>node ./prepEmailAlertsData</CodeSnippet> in
            wave-db-mgmt
          </ListItem>
          <ListItem>
            Verify the appropriate emails are in the{' '}
            <CodeSnippet>temp.users</CodeSnippet> collection.{' '}
            <a href="https://dedhamgroup.atlassian.net/wiki/spaces/POL/pages/705593837/Delphi+Email+Service" target="_new">
              See docs
            </a>
            {' '} for more information.
          </ListItem>
          <ListItem>
            Filter alerts by month:  
            <input
              type="month"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
             
          </ListItem>
        </ol>
      </section>
      <ButtonsWrapper>
        <Button onClick={() => handleSubmit('isPulseTest')} secondary>
          Send Pulse Test Email
        </Button>
        <Button onClick={() => handleSubmit('isTdgTest')} secondary>
          Send TDG Test Email
        </Button>
        <Button onClick={() => handleSubmit('pathwaysAlerts')}>
          Send Pathways Email
        </Button>
      </ButtonsWrapper>
    </Card>
  )
}

export default EmailAlerts
