import gql from 'graphql-tag'

export const PUSH_MARKET_BASKETS_TO_DEV = gql`
  mutation PushMarketBasketsToDev($input: PushMarketBasketsToDevInput!) {
    pushMarketBasketsToDev(input: $input) {
      _id
      name
      description
      productsRegimens
      categories
    }
  }
`

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
      categories
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
      categories
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
      categories
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

export const CREATE_MARKET_BASKET_SURVEY = gql`
  mutation CreateMarketBasketSurvey($input: CreateMarketBasketSurveyInput!) {
    createMarketBasketSurvey(input: $input) {
      id
      market_basket
      stakeholders
      date
    }
  }
`

export const UPDATE_MARKET_BASKET_SURVEY = gql`
  mutation UpdateMarketBasketSurvey($input: UpdateMarketBasketSurveyInput!) {
    updateMarketBasketSurvey(input: $input) {
      id
      market_basket
      stakeholders
      date
    }
  }
`

export const DELETE_MARKET_BASKET_SURVEY = gql`
  mutation DeleteMarketBasketSurvey($input: DeleteMarketBasketSurveyInput!) {
    deleteMarketBasketSurvey(input: $input) {
      id
      market_basket
      stakeholders
      date
    }
  }
`
