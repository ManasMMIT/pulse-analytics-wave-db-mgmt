import gql from 'graphql-tag'

export const PUSH_TEAM_USER_MARKET_BASKET_SUBSCRIPTIONS = gql`
  mutation PushUserMarketBasketSubsToDevAndProd($input: PushUserSubsToDevAndProdInput!) {
    pushUserMarketBasketSubsToDevAndProd(input: $input)
  }
`

export const SUBSCRIBE_TEAM_TO_MARKET_BASKET = gql`
  mutation SubscribeTeamToMarketBasket($input: SubscribeTeamToMarketBasketInput!) {
    subscribeTeamToMarketBasket(input: $input) {
      id
      team
      market_basket
      created_at
      updated_at
    }
  }
`

export const UNSUBSCRIBE_TEAM_TO_MARKET_BASKET = gql`
  mutation UnsubscribeTeamToMarketBasket($input: UnsubscribeTeamToMarketBasketInput!) {
    unsubscribeTeamToMarketBasket(input: $input) {
      id
      team
      market_basket
      created_at
      updated_at
    }
  }
`
