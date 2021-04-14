import gql from 'graphql-tag'

export const DELETE_MARKET_BASKET = gql`
  mutation DeleteMarketBasket($input: DeleteMarketBasketInput!) {
    deleteMarketBasket(input: $input) {
      id
      name
      description
      indication
      created_at
      updated_at
      products_regimens
      team_subscriptions
    }
  }
`

export const CREATE_MARKET_BASKET = gql`
  mutation CreateMarketBasket($input: CreateMarketBasketInput!) {
    createMarketBasket(input: $input) {
      id
      name
      description
      indication
      created_at
      updated_at
      products_regimens
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
      products_regimens
      team_subscriptions
    }
  }
`
