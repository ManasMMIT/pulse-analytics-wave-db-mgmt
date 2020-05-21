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

const payerProjects = require('./payerProject')

const businessObject = require('./businessObject')
const businessObjectModal = require('./businessObjectModal')

const book = require('./book')
const coverage = require('./coverage')
const population = require('./population')
const line = require('./line')

const importWorkbook = require('./importWorkbook')

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

    createSourceNode(input: CreateSourceNodeInput!): Node
    updateTeamNode(input: UpdateTeamNodeInput!): Node

    updateTdgTimestamps(input: UpdateTdgTimestampsInput!): JSON

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
    importWorkbook(input: [ImportWorkbookInput!]!): JSON
    backupExport(input: BackupExportInput!): String

    sendToSubscribedUsers(input: SendToSubscribedUsersInput!): SendToSubscribedUsersPayload
    sendToTestGroup(input: SendToTestGroupInput): SendToTestGroupPayload

    deleteSourceTreatmentPlan(input: DeleteSourceTreatmentPlanInput!): JSON
    createSourceTreatmentPlan(input: CreateSourceTreatmentPlanInput!): CreateSourceTreatmentPlanPayload
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

    createPayerProject(input: CreatePayerProjectInput!): CreatePayerProjectPayload
    updatePayerProjectPtps(input: UpdatePayerProjectPtpsInput!): JSON
    removePayerProjectPtps(input: RemovePayerProjectPtpsInput!): [ID]!
    transferPayerProjectPtps(input: TransferPayerProjectPtpsInput!): JSON

    createBusinessObject(input: CreateBusinessObjectInput!): BusinessObject
    createBusinessObjectField(input: CreateBusinessObjectFieldInput!): BoField
    deleteBusinessObject(input: DeleteBusinessObjectInput!): BusinessObject
    deleteBusinessObjectField(input: DeleteBusinessObjectFieldInput!): BoField
    updateBusinessObject(input: UpdateBusinessObjectInput!): BusinessObject
    updateBusinessObjectField(input: UpdateBusinessObjectFieldInput!): BoField

    createBusinessObjectModal(input: CreateBusinessObjectModalInput!): BomConfig
    deleteBusinessObjectModal(input: DeleteBusinessObjectModalInput!): BomConfig
    updateBusinessObjectModal(input: UpdateBusinessObjectModalInput!): BomConfig
    createBusinessObjectModalTag(input: CreateBusinessObjectModalTagInput!): BomTag
    updateBusinessObjectModalTag(input: UpdateBusinessObjectModalTagInput!): BomTag
    createBusinessObjectModalSection(input: CreateBusinessObjectModalSectionInput!): BomSection
    updateBusinessObjectModalSection(input: UpdateBusinessObjectModalSectionInput!): BomSection
    createBusinessObjectModalField(input: CreateBusinessObjectModalFieldInput!): BomField
    updateBusinessObjectModalField(input: UpdateBusinessObjectModalFieldInput!): BomField

    deleteBook(input: DeleteBookInput!): DeleteBookPayload
    createBook(input: CreateBookInput!): CreateBookPayload
    updateBook(input: UpdateBookInput!): UpdateBookPayload

    deleteCoverage(input: DeleteCoverageInput!): DeleteCoveragePayload
    createCoverage(input: CreateCoverageInput!): CreateCoveragePayload
    updateCoverage(input: UpdateCoverageInput!): UpdateCoveragePayload

    deletePopulation(input: DeletePopulationInput!): DeletePopulationPayload
    createPopulation(input: CreatePopulationInput!): CreatePopulationPayload
    updatePopulation(input: UpdatePopulationInput!): UpdatePopulationPayload

    deleteLine(input: DeleteLineInput!): DeleteLinePayload
    createLine(input: CreateLineInput!): CreateLinePayload
    updateLine(input: UpdateLineInput!): UpdateLinePayload
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

  ...payerProjects,

  ...businessObject,
  ...businessObjectModal,

  ...book,
  ...coverage,
  ...line,
  ...population,

  importWorkbook,
]
