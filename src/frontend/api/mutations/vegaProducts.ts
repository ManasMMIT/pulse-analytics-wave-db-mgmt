import gql from 'graphql-tag'

export const UPDATE_VEGA_PRODUCT = gql`
  mutation UpdateVegaProduct($input: UpdateVegaProductInput!) {
    updateVegaProduct(input: $input) {
      id
      generic_name
      brand_name
      logo_link
      color
      messaging
      regimens
    }
  }
`
