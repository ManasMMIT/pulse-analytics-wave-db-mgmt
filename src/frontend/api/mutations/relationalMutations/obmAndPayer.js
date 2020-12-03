import gql from 'graphql-tag'

export const UPSERT_OBM_AND_PAYER_CONNECTION = gql`
  mutation UpsertObmAndPayerConnection(
    $input: UpsertObmAndPayerConnectionInput!
  ) {
    upsertObmAndPayerConnection(input: $input) {
      _id
      payerId
      obmId
      note
      books
    }
  }
`

export const DELETE_OBM_AND_PAYER_CONNECTION = gql`
  mutation DeleteObmAndPayerConnection(
    $input: DeleteObmAndPayerConnectionInput!
  ) {
    deleteObmAndPayerConnection(input: $input) {
      _id
      payerId
      obmId
      note
      books
    }
  }
`
