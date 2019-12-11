import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  FILTER_QUERY,
} from './../../../../../api/mutations'

import { connectionSelectStyles } from './connectionSelectStyles'

import stateAbbreviations from './utils/state-abbreviations'

import {
  ConnectionFormLabel,
  SubmitNewConnectionButton,
} from './styledConnectionComponents'

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

const FormSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  margin: '12px 0px',
})

const CreateConnectionForm = ({
  from,
  vbmConnectionDoc,
  refetchQueries,
  postSubmitHook,
  onActionHook,
}) => {
  const [
    accountFilterOptions,
    setAccountFilterOptions,
  ] = useState(null)

  const [
    to,
    setTo,
  ] = useState({})

  const [
    state,
    setState,
  ] = useState({})

  const stateFilterOptions = stateAbbreviations.map(state => ({ label: state, value: state }))
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

  const [connect] = useMutation(vbmConnectionDoc, {
    variables: {
      input: {
        from,
        to: to.value,
        state: state.value,
      },
    },
    refetchQueries,
    update: () => {
      setTo({})
      postSubmitHook()
    },
    onCompleted: onActionHook,
  })

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
    <div>
      <FormSection>
        <ConnectionFormLabel>{formLanguage}</ConnectionFormLabel>
        <Select
          isClearable
          styles={connectionSelectStyles}
          defaultValue={null}
          onChange={(account, { action }) => {
            const to = action === 'clear'
              ? {}
              : account

            setTo(to)
          }}
          options={accountFilterOptions}
        />
      </FormSection>
      <FormSection>
        <ConnectionFormLabel>Relevant State: </ConnectionFormLabel>
        <Select
          styles={connectionSelectStyles}
          defaultValue={null}
          onChange={(state, { action }) => {
            setState(state)
          }}
          options={stateFilterOptions}
        />
        <div>

        </div>
      </FormSection>
      <SubmitNewConnectionButton
        disabled={!hasAllRequiredFields}
        onClick={connect}
      >
        connect
      </SubmitNewConnectionButton>
    </div>
  )
}

export default CreateConnectionForm
