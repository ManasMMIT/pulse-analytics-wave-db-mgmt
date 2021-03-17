import gql from 'graphql-tag'

export const CREATE_MARKET_BASKET = gql`
  mutation CreateMarketBasket($input: CreateMarketBasketInput!) {
    createMarketBasket(input: $input) {
      id
      name
      description
      indication
      created_at
      updated_at
      products
      team_subscriptions
    }
  }
`

export const UPDATE_MARKET_BASKET = gql`
  mutation UpdateMarketBasket($input: UpdateMarketBasketInput!) {
    updateMarketBasket(input: $input) {
      id
      name
      description
      indication
      created_at
      updated_at
      products
      team_subscriptions
    }
  }
`
