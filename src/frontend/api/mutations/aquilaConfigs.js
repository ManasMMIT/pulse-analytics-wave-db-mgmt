import gql from 'graphql-tag'

export const CREATE_AQUILA_CONFIG = gql`
  mutation CreateAquilaConfig($input: CreateAquilaConfigInput!) {
    createAquilaConfig(input: $input) {
      _id
      boId
      label
      fields {
        _id
        boFieldId
        label
        inputProps
      }
    }
  }
`

export const UPDATE_AQUILA_CONFIG = gql`
  mutation UpdateAquilaConfig($input: UpdateAquilaConfigInput!) {
    updateAquilaConfig(input: $input) {
      _id
      boId
      label
      fields {
        _id
        boFieldId
        label
        inputProps
      }
    }
  }
`

export const DELETE_AQUILA_CONFIG = gql`
  mutation DeleteAquilaConfig($input: DeleteAquilaConfigInput!) {
    deleteAquilaConfig(input: $input) {
      _id
      boId
      label
      fields {
        _id
        boFieldId
        label
        inputProps
      }
    }
  }
`


export const CREATE_AQUILA_CONFIG_FIELD = gql`
  mutation CreateAquilaConfigField($input: CreateAquilaConfigFieldInput!) {
    createAquilaConfigField(input: $input) {
      _id
      boFieldId
      label
      inputProps
    }
  }
`

export const UPDATE_AQUILA_CONFIG_FIELD = gql`
  mutation UpdateAquilaConfigField($input: UpdateAquilaConfigFieldInput!) {
    updateAquilaConfigField(input: $input) {
      _id
      boFieldId
      label
      inputProps
    }
  }
`


export const DELETE_AQUILA_CONFIG_FIELD = gql`
  mutation DeleteAquilaConfigField($input: DeleteAquilaConfigFieldInput!) {
    deleteAquilaConfigField(input: $input) {
      _id
      boFieldId
      label
      inputProps
    }
  }
`
