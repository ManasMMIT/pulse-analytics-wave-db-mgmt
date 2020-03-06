const { gql } = require('apollo-server-express')

const client = require('./client')
const teams = require('./teams')
const user = require('./user')
const sitemap = require('./sitemap')
const indication = require('./indication')
const product = require('./product')
const regimen = require('./regimen')
const organization = require('./organization')
const qualityAccessScore = require('./qualityAccessScore')
const collection = require('./collection')
const treatmentPlan = require('./treatmentPlan')
const testEmailGroup = require('./testEmailGroup')
const workbook = require('./workbook')

const email = require('./email')

const mutationType = gql`
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserPayload
    updateUser(input: UpdateUserInput!): UpdateUserPayload
    deleteUser(input: DeleteUserInput!): DeleteUserPayload

    createClient(input: CreateClientInput!): CreateClientPayload
    deleteClient(input: DeleteClientInput!): DeleteClientPayload
    updateClient(input: UpdateClientInput!): UpdateClientPayload

    createTeam(input: CreateTeamInput!): CreateTeamPayload
    updateTeam(input: UpdateTeamInput!): UpdateTeamPayload
    deleteTeam(input: DeleteTeamInput!): DeleteTeamPayload

    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
    updatePermissions(input: UpdatePermissionsInput!): UpdateTeamPayload
    pushSitemapToDev: String
    pushSitemapToProd: String

    createIndication(input: CreateIndicationInput!): CreateIndicationPayload
    updateSourceIndication(input: UpdateSourceIndicationInput!): UpdateSourceIndicationPayload
    deleteSourceIndication(input: DeleteSourceIndicationInput!): DeleteSourceIndicationPayload

    createProduct(input: CreateProductInput!): CreateProductPayload
    updateSourceProduct(input: UpdateSourceProductInput!): UpdateSourceProductPayload
    deleteSourceProduct(input: DeleteSourceProductInput!): DeleteSourceProductPayload

    createRegimen(input: CreateRegimenInput!): CreateRegimenPayload
    updateSourceRegimen(input: UpdateSourceRegimenInput!): UpdateSourceRegimenPayload
    deleteSourceRegimen(input: DeleteSourceRegimenInput!): DeleteSourceRegimenPayload

    createProviderOrganization(input: CreateProviderOrganizationInput!): CreateProviderOrganizationPayload
    deleteProviderOrganization(input: DeleteProviderOrganizationInput!): DeleteProviderOrganizationPayload
    updateProviderOrganization(input: UpdateProviderOrganizationInput!): UpdateProviderOrganizationPayload
    bulkImportProviderOrganizations(data: JSON): JSON

    createPayerOrganization(input: CreatePayerOrganizationInput!): CreatePayerOrganizationPayload
    deletePayerOrganization(input: DeletePayerOrganizationInput!): DeletePayerOrganizationPayload
    updatePayerOrganization(input: UpdatePayerOrganizationInput!): UpdatePayerOrganizationPayload

    createPathwaysOrganization(input: CreatePathwaysOrganizationInput!): CreatePathwaysOrganizationPayload
    deletePathwaysOrganization(input: DeletePathwaysOrganizationInput!): DeletePathwaysOrganizationPayload
    updatePathwaysOrganization(input: UpdatePathwaysOrganizationInput!): UpdatePathwaysOrganizationPayload

    createApmOrganization(input: CreateApmOrganizationInput!): CreateApmOrganizationPayload
    deleteApmOrganization(input: DeleteApmOrganizationInput!): DeleteApmOrganizationPayload
    updateApmOrganization(input: UpdateApmOrganizationInput!): UpdateApmOrganizationPayload

    upsertOrganizationMeta(input: UpsertOrganizationMetaInput!): [UpsertOrganizationMetaPayload]

    createQualityOfAccessScore(input: CreateQualityOfAccessScoreInput!): CreateQualityOfAccessScorePayload
    updateQualityOfAccessScore(input: UpdateQualityOfAccessScoreInput!): UpdateQualityOfAccessScorePayload
    deleteQualityOfAccessScore(input: DeleteQualityOfAccessScoreInput!): DeleteQualityOfAccessScorePayload

    uploadCollection(input: UploadCollectionInput!): JSON
    backupExport(input: BackupExportInput!): String

    sendToSubscribedUsers(input: SendToSubscribedUsersInput!): SendToSubscribedUsersPayload
    sendToTestGroup(input: SendToTestGroupInput): SendToTestGroupPayload

    bulkCreateTreatmentPlans(input: BulkCreateTreatmentPlansInput!): JSON

    createTestEmailGroup: TestEmailGroup
    updateTestEmailGroup(input: UpdateTestEmailGroupInput!): TestEmailGroup
    deleteTestEmailGroup(input: DeleteTestEmailGroupInput!): TestEmailGroup

    createWorkbook(input: CreateWorkbookInput!): CreateWorkbookPayload
    updateWorkbook(input: UpdateWorkbookInput!): UpdateWorkbookPayload
    deleteWorkbook(input: DeleteWorkbookInput!): DeleteWorkbookPayload
    
    createSheet(input: CreateSheetInput!): Sheet
    updateSheet(input: UpdateSheetInput!): Sheet
    deleteSheet(input: DeleteSheetInput!): Sheet

    createSheetField(input: CreateSheetFieldInput!): Field
    updateSheetField(input: UpdateSheetFieldInput!): Field
    deleteSheetField(input: DeleteSheetFieldInput!): Field

    filterQuery(input: JSON): JSON

    pipeDelimitedScript: JSON
  }
`

module.exports = [
  mutationType,
  ...client,
  ...teams,
  ...user,
  ...sitemap,
  ...indication,
  ...product,
  ...regimen,
  ...organization,
  ...qualityAccessScore,
  ...collection,
  ...treatmentPlan,
  
  ...email,

  ...testEmailGroup,
  ...workbook,
]
