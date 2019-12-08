import gql from 'graphql-tag'

export const CREATE_VBM_PARTICIPANT = gql`
  mutation CreateVbmParticipant($input: CreateVbmParticipantInput!) {
    createVbmParticipant(input: $input)
  }
`

export const CREATE_VBM_PARTICIPATION = gql`
  mutation CreateVbmParticipation($input: CreateVbmParticipationInput!) {
    createVbmParticipation(input: $input)
  }
`

export const CREATE_CONNECTION = gql`
  mutation CreateConnection($input: CreateConnectionInput!) {
    createConnection(input: $input) {
      _id
      org
      category
      type
      state
    }
  }
`

export const DELETE_VBM_CONNECTION = gql`
  mutation DeleteVbmConnection($input: DeleteVbmConnectionInput!) {
    deleteVbmConnection(input: $input)
  }
`
