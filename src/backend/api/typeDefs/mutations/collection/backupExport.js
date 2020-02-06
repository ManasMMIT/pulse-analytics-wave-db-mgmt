const { gql } = require('apollo-server-express')

const backupExportTypeDefs = gql`
  input BackupExportInput {
    data: JSON!
    filename: String!
  }
`

module.exports = backupExportTypeDefs
