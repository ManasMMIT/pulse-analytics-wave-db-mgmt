import React from 'react'

export default () => (
  <div
    style={{
      color: 'red',
      fontSize: 14,
      margin: '24px 0px',
      padding: 24,
      border: '1px dashed red',
    }}
  >
    <h1>Warning!</h1>
    <p>
      This will not cascade update any payer lives' figures. Contact Pulse for
      more information.
    </p>
    <p>
      Lives’ totals may need to be adjusted, affecting all lives’ percentages
      across{' '}
      <a
        style={{ color: 'blue' }}
        href="https://www.pulse-tools.com"
        target="_blank"
      >
        pulse-tools.com
      </a>
      .
    </p>
  </div>
)
