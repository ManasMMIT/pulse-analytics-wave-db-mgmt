import React from 'react'

const ConnectionsList = ({
  stagedConnections,
  // stageConnections,
  selectedConnectionId,
  selectConnectionId,
  payerOrgById,
}) => {
  return (
    <div style={{ width: '50%' }}>
      <h4>WIDGET UNDER CONSTRUCTION</h4>

      <div>
        <button
          style={{
            border: '1px solid black',
            cursor: 'pointer',
          }}
        >
          Add payer connection
        </button>
      </div>

      <div>
        {stagedConnections.map(({ _id, payerId, books }) => {
          const label = books
            .map(
              ({ name, isNational }) =>
                `${name} (${isNational ? 'National' : 'States'})`
            )
            .join(', ')

          return (
            <div
              key={_id}
              style={{
                color: _id === selectedConnectionId ? 'red' : 'black',
                border: '1px solid black',
                padding: 24,
              }}
              onClick={() => selectConnectionId(_id)}
            >
              <p>{payerOrgById[payerId]}</p>
              <p style={{ fontSize: 10 }}>{label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ConnectionsList
