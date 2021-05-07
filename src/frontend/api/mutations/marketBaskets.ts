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

export const DELETE_MARKET_BASKET_CATEGORY = gql`
  mutation DeleteMarketBasketCategory($input: DeleteMarketBasketCategoryInput!) {
    deleteMarketBasketCategory(input: $input) {
      id
      market_basket
      name
      category_type
      characteristics
      characteristics_full {
        id
        name
        description
      }
      prompt
      _order
    }
  }
`

export const CREATE_MARKET_BASKET_CATEGORY = gql`
  mutation CreateMarketBasketCategory($input: CreateMarketBasketCategoryInput!) {
    createMarketBasketCategory(input: $input) {
      id
      market_basket
      name
      category_type
      characteristics
      characteristics_full {
        id
        name
        description
      }
      prompt
      _order
    }
  }
`

export const UPDATE_MARKET_BASKET_CATEGORY = gql`
  mutation UpdateMarketBasketCategory($input: UpdateMarketBasketCategoryInput!) {
    updateMarketBasketCategory(input: $input) {
      id
      market_basket
      name
      category_type
      characteristics
      characteristics_full {
        id
        name
        description
      }
      prompt
      _order
    }
  }
`

export const CREATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC = gql`
  mutation CreateMarketBasketCategoryCharacteristic($input: CreateMarketBasketCategoryCharacteristicInput!) {
    createMarketBasketCategoryCharacteristic(input: $input) {
      id
      name
      description
    }
  }
`

export const UPDATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC = gql`
  mutation UpdateMarketBasketCategoryCharacteristic($input: UpdateMarketBasketCategoryCharacteristicInput!) {
    updateMarketBasketCategoryCharacteristic(input: $input) {
      id
      name
      description
    }
  }
`

export const DELETE_MARKET_BASKET_CATEGORY_CHARACTERISTIC = gql`
  mutation DeleteMarketBasketCategoryCharacteristic($input: DeleteMarketBasketCategoryCharacteristicInput!) {
    deleteMarketBasketCategoryCharacteristic(input: $input) {
      id
      name
      description
    }
  }
`
