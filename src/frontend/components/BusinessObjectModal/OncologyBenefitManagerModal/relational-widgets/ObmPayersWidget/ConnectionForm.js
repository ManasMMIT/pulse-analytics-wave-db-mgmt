import React from 'react'
import Select from 'react-select'

import stateAbbreviations from '../../../../../Orion/shared/AccountModals/AccountModalButton/AccountModalContent/ConnectionsSection/utils/state-abbreviations'

const ConnectionForm = ({ connection, allPayers }) => {
  const payerDropdownOptions = allPayers.map(({ _id, organization }) => ({
    value: _id,
    label: organization,
  }))

  const connectionObj = connection || {}

  return (
    <div
      style={{
        border: '1px solid black',
        width: '50%',
        padding: 24,
      }}
    >
      <Select
        isDisabled
        options={payerDropdownOptions}
        value={payerDropdownOptions.find(
          ({ value }) => value === connectionObj.payerId
        )}
      />

      <div>
        <label>
          Note:
          <input
            key={connectionObj._id}
            style={{ border: '1px solid black' }}
            type="text"
            value={connectionObj.note}
            disabled
          />
        </label>
      </div>

      <h2>Books:</h2>

      <div>
        <button
          style={{
            border: '1px solid black',
            cursor: 'pointer',
          }}
        >
          Add new book object
        </button>
      </div>

      {((connection && connection.books) || []).map(
        ({ _id, name, isNational, states }) => {
          return (
            <>
              <p>{name}</p>
              <Select
                isDisabled
                options={[
                  { label: 'National', value: 'National' },
                  { label: 'States', value: 'States' },
                ]}
                value={
                  isNational
                    ? {
                        label: 'National',
                        value: 'National',
                      }
                    : {
                        label: 'States',
                        value: 'States',
                      }
                }
              />

              {!isNational && (
                <Select
                  isDisabled
                  isMulti
                  options={stateAbbreviations.map((state) => ({
                    label: state,
                    value: state,
                  }))}
                  value={states.map((state) => ({
                    label: state,
                    value: state,
                  }))}
                />
              )}
            </>
          )
        }
      )}
    </div>
  )
}

export default ConnectionForm
