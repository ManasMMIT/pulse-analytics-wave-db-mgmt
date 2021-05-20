import gql from 'graphql-tag'

export const PUSH_SITEMAP_TO_DEV = gql`
  mutation PushSitemapToDev {
    pushSitemapToDev
  }
`

export const PUSH_SITEMAP_TO_PROD = gql`
  mutation PushSitemapToProd {
    pushSitemapToProd
  }
`

export const UPDATE_ROLE_SITEMAP = gql`
  fragment NodeFields on Node {
    _id
    name
    type
    componentPath
    text
    subtitle
    caption
    order
    parentId
  }

  mutation UpdateRoleSitemap($input: UpdateRoleSitemapInput!) {
    updateRoleSitemap(input: $input) {
      tools {
        ...NodeFields
      }
      dashboards {
        ...NodeFields
      }
      pages {
        ...NodeFields
      }
      cards {
        ...NodeFields
      }
    }
  }
`

export const UPDATE_TDG_TIMESTAMPS = gql`
  mutation UpdateTdgTimestamps($input: UpdateTdgTimestampsInput!) {
    updateTdgTimestamps(input: $input)
  }
`
