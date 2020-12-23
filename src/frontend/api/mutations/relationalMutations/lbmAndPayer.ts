import gql from 'graphql-tag'

export const UPSERT_LBM_AND_PAYER_CONNECTION = gql`
  mutation UpsertLbmAndPayerConnection(
    $input: UpsertLbmAndPayerConnectionInput!
  ) {
    upsertLbmAndPayerConnection(input: $input) {
      _id
      payerId
      lbmId
      note
      books
    }
  }
`

export const DELETE_LBM_AND_PAYER_CONNECTION = gql`
  mutation DeleteLbmAndPayerConnection(
    $input: DeleteLbmAndPayerConnectionInput!
  ) {
    deleteLbmAndPayerConnection(input: $input) {
      _id
      payerId
      lbmId
      note
      books
    }
  }
`
