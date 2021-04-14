import gql from 'graphql-tag'

export const CREATE_LISTS_CONFIG = gql`
  mutation CreateListsConfig($input: CreateListsConfigInput!) {
    createListsConfig(input: $input) {
      _id
      listId
      nodeId
      listTitle
      listInfo
      meta {
        location
        note
        type
      }
      dashboardTool
      labelKeys {
        labelKey
        labelName
        labelInfo
        valueWrapperType
      }
      createdOn
    }
  }
`

export const UPDATE_LISTS_CONFIG = gql`
  mutation UpdateListsConfig($input: UpdateListsConfigInput!) {
    updateListsConfig(input: $input) {
      _id
      listId
      nodeId
      listTitle
      listInfo
      meta {
        location
        note
        type
      }
      dashboardTool
      labelKeys {
        labelKey
        labelName
        labelInfo
        valueWrapperType
      }
      createdOn
    }
  }
`

export const DELETE_LISTS_CONFIG = gql`
  mutation DeleteListsConfig($input: DeleteListsConfigInput!) {
    deleteListsConfig(input: $input) {
      _id
      listId
      nodeId
      listTitle
      listInfo
      meta {
        location
        note
        type
      }
      dashboardTool
      labelKeys {
        labelKey
        labelName
        labelInfo
        valueWrapperType
      }
      createdOn
    }
  }
`