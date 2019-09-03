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

export const SELECT_TOOL = gql`
  mutation SelectTool($_id: String) {
    selectTool(_id: $_id) @client {
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
      tools { ...NodeFields }
      dashboards { ...NodeFields }
      pages { ...NodeFields }
      cards { ...NodeFields }
    }
  }
`

export const SELECT_DASHBOARD = gql`
  mutation SelectDashboard($_id: String) {
    selectDashboard(_id: $_id) @client {
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
  }
`

export const SELECT_PAGE = gql`
  mutation SelectPage($_id: String) {
    selectPage(_id: $_id) @client {
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
  }
`

export const SELECT_CARD = gql`
  mutation SelectCard($_id: String) {
    selectCard(_id: $_id) @client {
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
  }
`

export const SET_STAGED_SITEMAP = gql`
  mutation SetStagedSitemap($input: SitemapInput) {
    setStagedSitemap(input: $input) @client {
      _id
      tools
      dashboards
      pages
      cards
    }
  }
`
