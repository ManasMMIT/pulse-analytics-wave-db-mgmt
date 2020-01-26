import React from 'react'

import { useAuth0 } from './../../react-auth0-spa'
import useActionTracker from './../hooks/useActionTracker'

export default () => {
  const { user } = useAuth0()

  const {
    trackUserAction,
    history,
  } = useActionTracker({
    action: 'export all payer accounts',
    limit: 2
  })

  return (
    <div>
      <div>
        <div>Button History: export all payer accounts, limit 2</div>
        {
          history.map(({ action, user, createdAt }, idx) => (
              <div key={`${action}${createdAt}${idx}`}>
                <div>{user.nickname}</div>
                <div>{createdAt}</div>
              </div>
            ))
        }
      </div>
      <button
        onClick={() => trackUserAction(user)}
      >
        Click me to track new 'export all payer accounts' action
      </button>
    </div>
  )
}