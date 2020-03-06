import gql from 'graphql-tag'

export const CREATE_WORKBOOK = gql`
  mutation CreateWorkbook($input: CreateWorkbookInput!) {
    createWorkbook(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const UPDATE_WORKBOOK = gql`
  mutation UpdateWorkbook($input: UpdateWorkbookInput!) {
    updateWorkbook(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const DELETE_WORKBOOK = gql`
  mutation DeleteWorkbook($input: DeleteWorkbookInput!) {
    deleteWorkbook(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`
export const CREATE_SHEET = gql`
  mutation CreateSheet($input: CreateSheetInput!) {
    createSheet(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const UPDATE_SHEET = gql`
  mutation UpdateSheet($input: UpdateSheetInput!) {
    updateSheet(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const DELETE_SHEET = gql`
  mutation DeleteSheet($input: DeleteSheetInput!) {
    deleteSheet(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const CREATE_SHEET_FIELD = gql`
  mutation CreateSheetField($input: CreateSheetFieldInput!) {
    createSheetField(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const UPDATE_SHEET_FIELD = gql`
  mutation UpdateSheetField($input: UpdateSheetFieldInput!) {
    updateSheetField(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`

export const DELETE_SHEET_FIELD = gql`
  mutation DeleteSheetField($input: DeleteSheetFieldInput!) {
    deleteSheetField(input: $input) {
      _id
      name
      sheets {
        _id
        name
        fields {
          _id
          name
          type
          oneOf
        }
      }
    }
  }
`
