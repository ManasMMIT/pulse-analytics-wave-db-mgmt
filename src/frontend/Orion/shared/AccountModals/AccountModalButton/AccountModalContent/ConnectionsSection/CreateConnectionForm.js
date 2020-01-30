import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  FILTER_QUERY,
} from '../../../../../../api/mutations'

import { connectionSelectStyles } from './connectionSelectStyles'

import stateAbbreviations from './utils/state-abbreviations'

import {
  ConnectionFormLabel,
  SubmitNewConnectionButton,
} from './styledConnectionComponents'

const STATE_FILTER_OPTIONS = stateAbbreviations.map(state => ({ label: state, value: state }))

const ALLOWED_ORG_TYPES = {
  'Provider': [
    'Pathways',
    'Alternative Payment Model',
  ],
  'Payer': [
    'Pathways',
    'Alternative Payment Model',
  ],
  'Pathways': [
    'Payer',
    'Provider',
  ],
  'Alternative Payment Model': [
    'Payer',
    'Provider',
  ],
}

const wrapperStyle = {
  width: 'inherit',
  position: 'absolute',
  background: '#F0F6F9',
  padding: 24,
  boxShadow: `0 6px 24px 0 #0000001c`,
}

const FormSection = styled.div({
  margin: '12px 0px',
})

const CreateConnectionForm = ({
  from,
  addConnection,
}) => {
  const [
    accountFilterOptions,
    setAccountFilterOptions,
  ] = useState([])

  const [
    to,
    setTo,
  ] = useState({})

  const [
    note,
    setNote,
  ] = useState(null)

  const [
    alertData,
    setAlertData,
  ] = useState({
    alertType: 'Provider',
  })

  let providerStateOverride
  if (from.type === 'Provider') providerStateOverride = from.state

  const [
    usState,
    setUsState,
  ] = useState({ label: providerStateOverride, value: providerStateOverride })

  const [getAllowedOrgTypes] = useMutation(FILTER_QUERY)

  useEffect(() => {
    const orgTypes = ALLOWED_ORG_TYPES[from.type]

    getAllowedOrgTypes({
      variables: {
        input: {
          orgTypes,
        }
      }
    })
      .then(({ data: { filterQuery: accounts } }) => {
        const accountFilterOptions = accounts.map(account => ({
          label: `${account.organization} (${account.type})`,
          value: account,
        }))

        setAccountFilterOptions(accountFilterOptions)
      })
  }, [])

  const hasAllRequiredFields = Object.keys(to).length

  const formLanguage = from.type === 'Provider' || from.type === 'Payer'
    ? (
        <>
          <span style={{ fontWeight: 600 }}>
            {from.organization}
          </span>
          <span> participates in </span>
        </>
    )
    : 'Add participant:'

  return (
    <div style={wrapperStyle}>
      <FormSection>
        <ConnectionFormLabel>{formLanguage}</ConnectionFormLabel>
        <Select
          isClearable
          styles={connectionSelectStyles}
          defaultValue={null}
          onChange={(account, { action }) => {
            const to = action === 'clear'
              ? {}
              : account // this is a nested { label: X, value: Y } structure

            setTo(to)

            if (to.value && to.value.type === 'Provider') {
              setUsState({ label: to.value.state, value: to.value.state })
            }
          }}
          options={accountFilterOptions}
        />
      </FormSection>

      <FormSection>
        <ConnectionFormLabel>Relevant State: </ConnectionFormLabel>
        <Select
          // ! Note: If user is allowed to put in random state connections for provider, then when the provider's  
          // ! name, slug, state, or any other profile data changes, all the state fields on all the connections
          // ! related to the provider will be overridden due to update org resolver logic. To avoid this chaos,
          // ! DISABLE the "affiliated state" feature for provider connections. Plus we have to rethink "affiliated state"
          // ! versus "headquarters location" anyway from a data modeling perspective.
          isDisabled={Boolean(
            from.type === 'Provider' || (to.value && to.value.type === 'Provider')
          )}
          styles={connectionSelectStyles}
          defaultValue={usState}
          value={usState}
          onChange={(usState) => {
            setUsState(usState)
          }}
          options={STATE_FILTER_OPTIONS}
        />

      </FormSection>

      <FormSection>
        <ConnectionFormLabel>Note: </ConnectionFormLabel>
        <textArea
          onChange={e => {
            const newConnectionNote = e.target.value

            setNote(newConnectionNote)
          }}
        />
      </FormSection>

      <FormSection>
        <ConnectionFormLabel>Alert Date: </ConnectionFormLabel>
        <input
          type="date"
          value={alertData.alertDate || null}
          onChange={e => {
            const newAlertDate = e.target.value

            setAlertData({
              ...alertData,
              alertDate: newAlertDate,
            })
          }}
        />
      </FormSection>
      <FormSection>
        <ConnectionFormLabel>Alert Description: </ConnectionFormLabel>
        <textArea
          onChange={e => {
            const newAlertDescription = e.target.value

            setAlertData({
              ...alertData,
              alertDescription: newAlertDescription,
            })
          }}
        />
      </FormSection>
      <FormSection>
        <ConnectionFormLabel>Alert Type: </ConnectionFormLabel>
        <Select
          isDisabled
          styles={connectionSelectStyles}
          defaultValue={{ label: 'Provider', value: 'Provider'}}
          value={{ label: 'Provider', value: 'Provider'}}
          options={[{ label: 'Provider', value: 'Provider' }]}
        />
      </FormSection>


      <SubmitNewConnectionButton
        disabled={!hasAllRequiredFields}
        onClick={() => {
          const connection = {
            org: to.value,
            state: usState.value,
            category: "Value-Based Model Participation",
            note,
            alert: alertData,
          }

          addConnection(connection)
        }}
      >
        connect
      </SubmitNewConnectionButton>
    </div>
  )
}

export default CreateConnectionForm
