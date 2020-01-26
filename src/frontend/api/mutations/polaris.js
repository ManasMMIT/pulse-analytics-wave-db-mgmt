import gql from 'graphql-tag'

export const TRACK_USER_ACTION = gql`
  mutation TrackUserAction($input: TrackUserActionInput!) {
    trackUserAction(input: $input) {
      history {
        action
        user
        createdAt
      }
    }
  }
`
