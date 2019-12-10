import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'

import {
  FILTER_QUERY,
} from './../../../../../api/mutations'

import stateAbbreviations from './utils/state-abbreviations'

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

const sharedSelectStyles = {
  minWidth: 300,
  fontSize: 12,
}

const selectStyles = {
  option: provided => ({
    ...provided,
    ...sharedSelectStyles
  }),
  control: provided => ({
    ...provided,
    ...sharedSelectStyles,
    marginLeft: 6,
    border: 'none',
    ':focus': {
      outline: 'none !important',
    }
  }),
}

const CreateConnectionForm = ({
  from,
  vbmConnectionDoc,
  refetchQueries,
  postSubmitHook,
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
    }
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
        <div>{formLanguage}</div>
        <Select
          isClearable
          styles={selectStyles}
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
        <div>Relevant State: </div>
        <Select
          styles={selectStyles}
          defaultValue={null}
          onChange={(state, { action }) => {
            setState(state)
          }}
          options={stateFilterOptions}
        />
        <div>

        </div>
      </FormSection>
      <button
        disabled={!hasAllRequiredFields}
        onClick={connect}
      >
        connect
      </button>
    </div>
  )
}

export default CreateConnectionForm
