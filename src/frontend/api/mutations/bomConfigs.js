import gql from 'graphql-tag'

export const DELETE_BOM_CONFIG_FIELD = gql`
  mutation DeleteBusinessObjectModalField($input: DeleteBusinessObjectModalFieldInput!) {
    deleteBusinessObjectModalField(input: $input) {
      _id
      label
      inputComponent
      inputProps
    }
  }
`

export const CREATE_BOM_CONFIG_FIELD = gql`
  mutation CreateBusinessObjectModalField($input: CreateBusinessObjectModalFieldInput!) {
    createBusinessObjectModalField(input: $input) {
      _id
      label
      inputComponent
      inputProps
    }
  }
`

export const UPDATE_BOM_CONFIG_FIELD = gql`
  mutation UpdateBusinessObjectModalField($input: UpdateBusinessObjectModalFieldInput!) {
    updateBusinessObjectModalField(input: $input) {
      _id
      label
      inputComponent
      inputProps
    }
  }
`

export const CREATE_BOM_CONFIG_SECTION = gql`
  mutation CreateBusinessObjectModalSection($input: CreateBusinessObjectModalSectionInput!) {
    createBusinessObjectModalSection(input: $input) {
      _id
      label
      fields {
        _id
        label
        inputComponent
        inputProps
      }
    }
  }
`

export const DELETE_BOM_CONFIG_SECTION = gql`
  mutation DeleteBusinessObjectModalSection($input: DeleteBusinessObjectModalSectionInput!) {
    deleteBusinessObjectModalSection(input: $input) {
        _id
        label
        fields {
          _id
          label
          inputComponent
          inputProps
        }
      }
  }
`

export const DELETE_BOM_CONFIG_TAB = gql`
  mutation DeleteBusinessObjectModalTab($input: DeleteBusinessObjectModalTagInput!) {
    deleteBusinessObjectModalTag(input: $input) {
      _id
      label
      sections {
        _id
        label
        fields {
          _id
          label
          inputComponent
          inputProps
        }
      }
    }
  }
`

export const UPDATE_BOM_CONFIG_SECTION = gql`
  mutation UpdateBusinessObjectModalSection($input: UpdateBusinessObjectModalSectionInput!) {
    updateBusinessObjectModalSection(input: $input) {
      _id
      label
      fields {
        _id
        label
        inputComponent
        inputProps
      }
    }
  }
`

export const CREATE_BOM_CONFIG_TAB = gql`
  mutation CreateBusinessObjectModalTab($input: CreateBusinessObjectModalTagInput!) {
    createBusinessObjectModalTag(input: $input) {
      _id
      label
      sections {
        _id
        label
        fields {
          _id
          label
          inputComponent
          inputProps
        }
      }
    }
  }
`

export const DELETE_BOM_CONFIG = gql`
  mutation DeleteBusinessObjectModal($input: DeleteBusinessObjectModalInput!) {
    deleteBusinessObjectModal(input: $input) {
      _id
      label
      tags {
        _id
        label
        sections {
          _id
          label
          fields {
            _id
            label
            inputComponent
            inputProps
          }
        }
      }
    }
  }
`

export const UPDATE_BOM_CONFIG_TAB = gql`
  mutation UpdateBusinessObjectModalTab($input: UpdateBusinessObjectModalTagInput!) {
    updateBusinessObjectModalTag(input: $input) {
      _id
      label
      sections {
        _id
        label
        fields {
          _id
          label
          inputComponent
          inputProps
        }
      }
    }
  }
`

export const CREATE_BOM_CONFIG = gql`
  mutation CreateBusinessObjectModal($input: CreateBusinessObjectModalInput!) {
    createBusinessObjectModal(input: $input) {
      _id
      label
      tags {
        _id
        label
        sections {
          _id
          label
          fields {
            _id
            label
            inputComponent
            inputProps
          }
        }
      }
    }
  }
`

export const UPDATE_BOM_CONFIG = gql`
  mutation UpdateBusinessObjectModal($input: UpdateBusinessObjectModalInput!) {
    updateBusinessObjectModal(input: $input) {
      _id
      label
      tags {
        _id
        label
        sections {
          _id
          label
          fields {
            _id
            label
            inputComponent
            inputProps
          }
        }
      }
    }
  }
`
