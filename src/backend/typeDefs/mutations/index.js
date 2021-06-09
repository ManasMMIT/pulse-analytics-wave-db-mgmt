import vegaTypeDefs from '../vega/mutations'

import node from './node'
import marketBasket from './marketBasket'

import listsConfig from './listsConfig'

const { gql } = require('apollo-server-express')

const client = require('./client')
const teams = require('./teams')
const user = require('./user')
const sitemap = require('./sitemap')
const indication = require('./indication')
const therapeuticArea = require('./therapeuticArea')
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
const aquilaConfig = require('./aquilaConfig')

const book = require('./book')
const coverage = require('./coverage')
const population = require('./population')
const line = require('./line')

const importWorkbook = require('./importWorkbook')

const person = require('./person')

const endUserTerms = require('./endUserTerms')

const usState = require('./usState')

const devToProdPushConfig = require('./devToProdPushConfig')

const relationalTypeDefs = require('./relationalTypeDefs')

const mutationType = gql`
  type Mutation {
    createListsConfig(input: CreateListsConfigInput!): ListsConfig
    updateListsConfig(input: UpdateListsConfigInput!): ListsConfig
    deleteListsConfig(input: DeleteListsConfigInput!): ListsConfig

    pushMarketBasketsToDev(
      input: PushMarketBasketsToDevInput!
    ): [DevMarketBasket!]

    importMarketBasketSurvey(input: ImportMarketBasketSurveyInput!): JSON

    deleteMarketBasket(input: DeleteMarketBasketInput!): MarketBasket
    createMarketBasket(input: CreateMarketBasketInput!): MarketBasket
    updateMarketBasket(input: UpdateMarketBasketInput!): MarketBasket

    createMarketBasketCategory(
      input: CreateMarketBasketCategoryInput!
    ): MarketBasketCategory
    updateMarketBasketCategory(
      input: UpdateMarketBasketCategoryInput!
    ): MarketBasketCategory
    deleteMarketBasketCategory(
      input: DeleteMarketBasketCategoryInput!
    ): MarketBasketCategory

    createMarketBasketCategoryCharacteristic(
      input: CreateMarketBasketCategoryCharacteristicInput!
    ): MarketBasketCategoryCharacteristic
    updateMarketBasketCategoryCharacteristic(
      input: UpdateMarketBasketCategoryCharacteristicInput!
    ): MarketBasketCategoryCharacteristic
    deleteMarketBasketCategoryCharacteristic(
      input: DeleteMarketBasketCategoryCharacteristicInput!
    ): MarketBasketCategoryCharacteristic

    createMarketBasketSurvey(
      input: CreateMarketBasketSurveyInput!
    ): MarketBasketSurvey
    updateMarketBasketSurvey(
      input: UpdateMarketBasketSurveyInput!
    ): MarketBasketSurvey
    deleteMarketBasketSurvey(
      input: DeleteMarketBasketSurveyInput!
    ): MarketBasketSurvey

    createUser(input: CreateUserInput!): User
    updateUser(input: UpdateUserInput!): User
    deleteUser(input: DeleteUserInput!): User

    createClient(input: CreateClientInput!): Client
    deleteClient(input: DeleteClientInput!): Client
    updateClient(input: UpdateClientInput!): Client

    createTeam(input: CreateTeamInput!): Team
    updateTeam(input: UpdateTeamInput!): Team
    deleteTeam(input: DeleteTeamInput!): Team

    createNode(input: CreateNodeInput): Node
    updateNode(input: UpdateNodeInput): Node
    updateTeamNode(input: UpdateTeamNodeInput!): Node

    updateTdgTimestamps(input: UpdateTdgTimestampsInput!): JSON

    updateRoleSitemap(input: UpdateRoleSitemapInput!): UpdateRoleSitemapPayload
    updatePermissions(input: UpdatePermissionsInput!): Team
    pushSitemapToDev: String
    pushSitemapToProd: String

    createIndication(input: CreateIndicationInput!): CreateIndicationPayload
    updateSourceIndication(
      input: UpdateSourceIndicationInput!
    ): UpdateSourceIndicationPayload
    deleteSourceIndication(
      input: DeleteSourceIndicationInput!
    ): DeleteSourceIndicationPayload

    createTherapeuticArea(
      input: CreateTherapeuticAreaInput!
    ): CreateTherapeuticAreaPayload!
    updateTherapeuticArea(
      input: UpdateTherapeuticAreaInput!
    ): UpdateTherapeuticAreaPayload!
    deleteTherapeuticArea(
      input: DeleteTherapeuticAreaInput!
    ): DeleteTherapeuticAreaPayload!

    createProduct(input: CreateProductInput!): CreateProductPayload
    updateSourceProduct(
      input: UpdateSourceProductInput!
    ): UpdateSourceProductPayload
    deleteSourceProduct(
      input: DeleteSourceProductInput!
    ): DeleteSourceProductPayload

    createRegimen(input: CreateRegimenInput!): CreateRegimenPayload
    updateSourceRegimen(
      input: UpdateSourceRegimenInput!
    ): UpdateSourceRegimenPayload
    deleteSourceRegimen(
      input: DeleteSourceRegimenInput!
    ): DeleteSourceRegimenPayload

    createProviderOrganization(
      input: CreateProviderOrganizationInput!
    ): CreateProviderOrganizationPayload
    deleteProviderOrganization(
      input: DeleteProviderOrganizationInput!
    ): DeleteProviderOrganizationPayload
    updateProviderOrganization(
      input: UpdateProviderOrganizationInput!
    ): UpdateProviderOrganizationPayload
    bulkImportProviderOrganizations(data: JSON): JSON

    createPayerOrganization(
      input: CreatePayerOrganizationInput!
    ): CreatePayerOrganizationPayload
    deletePayerOrganization(
      input: DeletePayerOrganizationInput!
    ): DeletePayerOrganizationPayload
    updatePayerOrganization(
      input: UpdatePayerOrganizationInput!
    ): UpdatePayerOrganizationPayload

    createPathwaysOrganization(
      input: CreatePathwaysOrganizationInput!
    ): CreatePathwaysOrganizationPayload
    deletePathwaysOrganization(
      input: DeletePathwaysOrganizationInput!
    ): DeletePathwaysOrganizationPayload
    updatePathwaysOrganization(
      input: UpdatePathwaysOrganizationInput!
    ): UpdatePathwaysOrganizationPayload

    createApmOrganization(
      input: CreateApmOrganizationInput!
    ): CreateApmOrganizationPayload
    deleteApmOrganization(
      input: DeleteApmOrganizationInput!
    ): DeleteApmOrganizationPayload
    updateApmOrganization(
      input: UpdateApmOrganizationInput!
    ): UpdateApmOrganizationPayload

    createObmOrganization(
      input: CreateObmOrganizationInput!
    ): CreateObmOrganizationPayload!
    deleteObmOrganization(
      input: DeleteObmOrganizationInput!
    ): DeleteObmOrganizationPayload!
    updateObmOrganization(
      input: UpdateObmOrganizationInput!
    ): UpdateObmOrganizationPayload!

    createLbmOrganization(input: CreateLbmOrganizationInput!): LbmOrganization! # reusing LbmOrganization type from src/backend/typeDefs/queries.js
    deleteLbmOrganization(input: DeleteLbmOrganizationInput!): LbmOrganization!
    updateLbmOrganization(input: UpdateLbmOrganizationInput!): LbmOrganization!

    createObmService(input: CreateObmServiceInput!): CreateObmServicePayload!
    updateObmService(input: UpdateObmServiceInput!): UpdateObmServicePayload!
    deleteObmService(input: DeleteObmServiceInput!): DeleteObmServicePayload!

    createLbmService(input: CreateLbmServiceInput!): CreateLbmServicePayload!
    updateLbmService(input: UpdateLbmServiceInput!): UpdateLbmServicePayload!
    deleteLbmService(input: DeleteLbmServiceInput!): DeleteLbmServicePayload!

    createObmServiceCategory(
      input: CreateObmServiceCategoryInput!
    ): CreateObmServiceCategoryPayload!
    updateObmServiceCategory(
      input: UpdateObmServiceCategoryInput!
    ): UpdateObmServiceCategoryPayload!
    deleteObmServiceCategory(
      input: DeleteObmServiceCategoryInput!
    ): DeleteObmServiceCategoryPayload!

    createLbmServiceCategory(
      input: CreateLbmServiceCategoryInput!
    ): CreateLbmServiceCategoryPayload!
    updateLbmServiceCategory(
      input: UpdateLbmServiceCategoryInput!
    ): UpdateLbmServiceCategoryPayload!
    deleteLbmServiceCategory(
      input: DeleteLbmServiceCategoryInput!
    ): DeleteLbmServiceCategoryPayload!

    createObmType(input: CreateObmTypeInput!): CreateObmTypePayload!
    updateObmType(input: UpdateObmTypeInput!): UpdateObmTypePayload!
    deleteObmType(input: DeleteObmTypeInput!): DeleteObmTypePayload!

    createLbmType(input: CreateLbmTypeInput!): LbmType!
    updateLbmType(input: UpdateLbmTypeInput!): LbmType!
    deleteLbmType(input: DeleteLbmTypeInput!): LbmType!

    connectObmServiceAndObmServiceCategory(
      input: ConnectObmServiceAndObmServiceCategoryInput!
    ): ConnectObmServiceAndObmServiceCategoryPayload!

    connectLbmServiceAndLbmServiceCategory(
      input: ConnectLbmServiceAndLbmServiceCategoryInput!
    ): ConnectLbmServiceAndLbmServiceCategoryPayload!

    connectObmAndObmService(
      input: [ConnectObmAndObmServiceInput!]!
    ): [ConnectObmAndObmServicePayload!]!

    connectLbmAndLbmService(
      input: [ConnectLbmAndLbmServiceInput!]!
    ): [ConnectLbmAndLbmServicePayload!]!

    connectObmAndObmType(
      input: ConnectObmAndObmTypeInput!
    ): ConnectObmAndObmTypePayload!

    connectLbmAndLbmType(
      input: ConnectLbmAndLbmTypeInput!
    ): ConnectLbmAndLbmTypePayload!

    connectObmAndPerson(
      input: [ConnectObmAndPersonInput!]!
    ): [ConnectObmAndPersonPayload!]!

    connectLbmAndPerson(
      input: [ConnectLbmAndPersonInput!]!
    ): [ConnectLbmAndPersonPayload!]!

    connectObmAndKeyEvent(input: ConnectObmAndKeyEventInput!): [ObmKeyEvent!]!
    connectLbmAndKeyEvent(input: ConnectLbmAndKeyEventInput!): [LbmKeyEvent!]!

    upsertOrganizationMeta(
      input: UpsertOrganizationMetaInput!
    ): [UpsertOrganizationMetaPayload]

    createQualityOfAccessScore(
      input: CreateQualityOfAccessScoreInput!
    ): CreateQualityOfAccessScorePayload
    updateQualityOfAccessScore(
      input: UpdateQualityOfAccessScoreInput!
    ): UpdateQualityOfAccessScorePayload
    deleteQualityOfAccessScore(
      input: DeleteQualityOfAccessScoreInput!
    ): DeleteQualityOfAccessScorePayload

    uploadCollection(input: UploadCollectionInput!): JSON
    importWorkbook(input: [ImportWorkbookInput!]!): JSON
    backupExport(input: BackupExportInput!): String

    sendToSubscribedUsers(
      input: SendToSubscribedUsersInput!
    ): SendToSubscribedUsersPayload
    sendToTestGroup(input: SendToTestGroupInput): SendToTestGroupPayload

    deleteSourceTreatmentPlan(input: DeleteSourceTreatmentPlanInput!): JSON
    createSourceTreatmentPlan(
      input: CreateSourceTreatmentPlanInput!
    ): CreateSourceTreatmentPlanPayload
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

    createPayerProject(
      input: CreatePayerProjectInput!
    ): CreatePayerProjectPayload
    deletePayerProject(
      input: DeletePayerProjectInput!
    ): DeletePayerProjectPayload
    updatePayerProjectPtps(input: UpdatePayerProjectPtpsInput!): JSON
    removePayerProjectPtps(input: RemovePayerProjectPtpsInput!): [ID]!
    transferPayerProjectPtps(input: TransferPayerProjectPtpsInput!): JSON
    updatePayerProjectName(input: UpdatePayerProjectNameInput!): JSON

    createBusinessObject(input: CreateBusinessObjectInput!): BusinessObject
    createBusinessObjectField(input: CreateBusinessObjectFieldInput!): BoField
    deleteBusinessObject(input: DeleteBusinessObjectInput!): BusinessObject
    deleteBusinessObjectField(input: DeleteBusinessObjectFieldInput!): BoField
    updateBusinessObject(input: UpdateBusinessObjectInput!): BusinessObject
    updateBusinessObjectField(input: UpdateBusinessObjectFieldInput!): BoField

    createBusinessObjectModal(
      input: CreateBusinessObjectModalInput!
    ): BomConfig!
    deleteBusinessObjectModal(
      input: DeleteBusinessObjectModalInput!
    ): BomConfig!
    updateBusinessObjectModal(
      input: UpdateBusinessObjectModalInput!
    ): BomConfig!
    createBusinessObjectModalTag(
      input: CreateBusinessObjectModalTagInput!
    ): BomTag!
    deleteBusinessObjectModalTag(
      input: DeleteBusinessObjectModalTagInput!
    ): BomTag!
    updateBusinessObjectModalTag(
      input: UpdateBusinessObjectModalTagInput!
    ): BomTag!
    createBusinessObjectModalSection(
      input: CreateBusinessObjectModalSectionInput!
    ): BomSection!
    deleteBusinessObjectModalSection(
      input: DeleteBusinessObjectModalSectionInput!
    ): BomSection!
    updateBusinessObjectModalSection(
      input: UpdateBusinessObjectModalSectionInput!
    ): BomSection!
    createBusinessObjectModalField(
      input: CreateBusinessObjectModalFieldInput!
    ): BomField!
    deleteBusinessObjectModalField(
      input: DeleteBusinessObjectModalFieldInput!
    ): BomField!
    updateBusinessObjectModalField(
      input: UpdateBusinessObjectModalFieldInput!
    ): BomField!

    createAquilaConfig(input: CreateAquilaConfigInput!): AquilaConfig!
    createAquilaConfigField(
      input: CreateAquilaConfigFieldInput!
    ): AquilaConfigField!
    updateAquilaConfig(input: UpdateAquilaConfigInput!): AquilaConfig!
    updateAquilaConfigField(
      input: UpdateAquilaConfigFieldInput!
    ): AquilaConfigField!
    deleteAquilaConfig(input: DeleteAquilaConfigInput!): AquilaConfig!
    deleteAquilaConfigField(
      input: DeleteAquilaConfigFieldInput!
    ): AquilaConfigField!

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

    createPerson(input: CreatePersonInput!): CreatePersonPayload
    updatePerson(input: UpdatePersonInput!): UpdatePersonPayload
    deletePerson(input: DeletePersonInput!): DeletePersonPayload

    updateVegaPerson(input: UpdateVegaPersonInput!): VegaPerson!

    createVegaPersonRole(input: CreateVegaPersonRoleInput!): VegaPersonRole
    updateVegaPersonRole(input: UpdateVegaPersonRoleInput!): VegaPersonRole
    deleteVegaPersonRole(input: DeleteVegaPersonRoleInput!): VegaPersonRole

    createVegaPersonRoleIndication(
      input: CreateVegaPersonRoleIndicationInput!
    ): VegaPersonRoleIndication
    updateVegaPersonRoleIndication(
      input: UpdateVegaPersonRoleIndicationInput!
    ): VegaPersonRoleIndication
    deleteVegaPersonRoleIndication(
      input: DeleteVegaPersonRoleIndicationInput!
    ): VegaPersonRoleIndication

    createVegaPersonRoleType(
      input: CreateVegaPersonRoleTypeInput!
    ): VegaPersonRoleType
    updateVegaPersonRoleType(
      input: UpdateVegaPersonRoleTypeInput!
    ): VegaPersonRoleType
    deleteVegaPersonRoleType(
      input: DeleteVegaPersonRoleTypeInput!
    ): VegaPersonRoleType

    updateEndUserTerms(
      input: UpdateEndUserTermsInput!
    ): UpdateEndUserTermsPayload

    createUsState(input: CreateUsStateInput!): CreateUsStatePayload!
    updateUsState(input: UpdateUsStateInput!): UpdateUsStatePayload!
    deleteUsState(input: DeleteUsStateInput!): DeleteUsStatePayload!

    createDevToProdPushConfig: DevToProdPushConfig!
    updateDevToProdPushConfig(
      input: UpdateDevToProdPushConfigInput!
    ): DevToProdPushConfig!
    deleteDevToProdPushConfig(
      input: DeleteDevToProdPushConfigInput!
    ): DevToProdPushConfig!

    pushDevToProd(input: PushDevToProdInput!): String!
    psqlPushCoreToProd: String!

    upsertPathwaysAndPersonConnection(
      input: UpsertPathwaysAndPersonConnectionInput!
    ): PathwaysAndPersonConnection!

    deletePathwaysAndPersonConnection(
      input: DeletePathwaysAndPersonConnectionInput!
    ): PathwaysAndPersonConnection!

    upsertObmAndPayerConnection(
      input: UpsertObmAndPayerConnectionInput!
    ): ObmAndPayerConnection!

    deleteObmAndPayerConnection(
      input: DeleteObmAndPayerConnectionInput!
    ): ObmAndPayerConnection!

    upsertLbmAndPayerConnection(
      input: UpsertLbmAndPayerConnectionInput!
    ): LbmAndPayerConnection!

    deleteLbmAndPayerConnection(
      input: DeleteLbmAndPayerConnectionInput!
    ): LbmAndPayerConnection!
  }
`

module.exports = [
  mutationType,

  ...vegaTypeDefs,

  ...client,
  ...teams,
  ...user,
  ...node,
  ...sitemap,
  ...indication,
  ...therapeuticArea,
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
  ...aquilaConfig,

  ...book,
  ...coverage,
  ...line,
  ...population,

  importWorkbook,
  ...person,
  ...endUserTerms,
  ...usState,

  ...devToProdPushConfig,

  ...relationalTypeDefs,
  ...marketBasket,

  ...listsConfig,
]
