import gql from 'graphql-tag'

export const IMPORT_WORKBOOK = gql`
  mutation ImportWorkbook($input: [ImportWorkbookInput!]!) {
    importWorkbook(input: $input)
  }
`
