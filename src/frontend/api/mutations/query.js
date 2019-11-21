import gql from 'graphql-tag'

export const FILTER_QUERY = gql`
  mutation FilterQuery($input: JSON) {
    filterQuery(input: $input)
  }
`
