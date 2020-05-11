import gql from 'graphql-tag'

export const BACKUP_EXPORT = gql`
  mutation BackupExport($input: BackupExportInput!) {
    backupExport(input: $input)
  }
`

export const UPLOAD_COLLECTION = gql`
  mutation UploadCollection($input: UploadCollectionInput!) {
    uploadCollection(input: $input)
  }
`
