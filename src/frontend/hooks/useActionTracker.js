import {
  useState
} from 'react'

import {
  useQuery,
  useMutation,
} from '@apollo/react-hooks'

import {
  GET_POLARIS_USER_ACTIONS,
} from './../api/queries'

import {
  TRACK_USER_ACTION,
} from './../api/mutations'

export default ({
  action,
  limit,
}) => {
  const [history, setHistory] = useState([])

  useQuery(GET_POLARIS_USER_ACTIONS, {
    variables: {
      action,
      limit,
    },
    onCompleted: ({ actionTracker }) => setHistory(actionTracker)
  })


  const [trackUserActionMutation] = useMutation(TRACK_USER_ACTION)

  const trackUserAction = user => trackUserActionMutation({
    variables: {
      input: {
        user,
        action,
        limit,
      }
    },
    update: (
      cache,
      { data: { trackUserAction: { history } } }
    ) => setHistory(history)
  })

  return {
    trackUserAction,
    history,
  }
}
