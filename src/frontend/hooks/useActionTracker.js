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

export default (action, limit) => {
  const [trackUserActionMutation] = useMutation(TRACK_USER_ACTION)

  const trackUserAction = user => trackUserActionMutation({
    variables: {
      input: {
        userId: user.userId,
        action,
        limit,
      }
    }
  })

  const { data: actionHistory, loading } = useQuery(GET_POLARIS_USER_ACTIONS, {
    variables: {
      action,
      limit,
    }
  })

  return {
    trackUserAction,
    actionHistory: loading ? {} : actionHistory,
  }
}
