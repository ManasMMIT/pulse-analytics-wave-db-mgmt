const combineLives = require('./combine-lives')
const qualityAccessAndAddCriteriaOrgTpHistoryAggPip = require('./agg-pipelines/quality-access-addit-criteria-last-org-tp-history-agg-pip')
const policyLinkAggPipeline = require('./agg-pipelines/policy-link-agg-pipeline')

const {
  formatQualityAccessDoc,
  formatAdditionalCriteriaDoc,
  formatCombinedDataDoc,
} = require('./formatters')

const isValidAddCritDoc = ({ additionalCriteriaData }) => (
  additionalCriteriaData && additionalCriteriaData.criteria
)

const isValidQualityAccessDoc = ({ accessData }) => accessData && accessData.access

class PayerHistoryManager {
  constructor({ pulseDev, pulseCore }) {
    this.pulseDev = pulseDev
    this.pulseCore = pulseCore

    this.nonLivesCollectionDocs = null
  }

  async getNonLivesCollectionDocs() {
    console.log('grabbing payer historical data')

    const qualityAccessAndAdditionalCriteriaSixMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        qualityAccessAndAddCriteriaOrgTpHistoryAggPip(6),
        { allowDiskUse: true }
      )
      .toArray()

    const qualityAccessAndAdditionalCriteriaOneMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        qualityAccessAndAddCriteriaOrgTpHistoryAggPip(1),
        { allowDiskUse: true }
      )
      .toArray()

    const policyLinkSixMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        policyLinkAggPipeline(6),
        { allowDiskUse: true }
      )
      .toArray()

    const policyLinkOneMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        policyLinkAggPipeline(1),
        { allowDiskUse: true }
      )
      .toArray()

    const [
      lastSixMonthDocs,
      lastMonthDocs,
      formattedPolicyLinkLastSixMonthDocs, // payer link agg pipeline already formats this, weeds out null links
      formattedPolicyLinkLastMonthDocs,  // payer link agg pipeline already formats this, weeds out null links
    ] = await Promise.all([
      qualityAccessAndAdditionalCriteriaSixMonthOp,
      qualityAccessAndAdditionalCriteriaOneMonthOp,
      policyLinkSixMonthOp,
      policyLinkOneMonthOp,
    ])

    console.log('formatting docs to write to payer collections')

    const [
      formattedQualityAccessLastSixMonthsDocs,
      formattedAdditionalCriteriaLastSixMonthsDocs,
    ] = lastSixMonthDocs.reduce((acc, doc) => {
      if (isValidQualityAccessDoc(doc)) {
        acc[0].push(formatQualityAccessDoc(doc))
      }

      if (isValidAddCritDoc(doc)) {
        acc[1].push(formatAdditionalCriteriaDoc(doc))
      }

      return acc
    }, [[], []])

    const [
      formattedQualityAccessLastMonthDocs,
      formattedAdditionalCriteriaLastMonthDocs,
      formattedCombinedDataDocs,
    ] = lastMonthDocs.reduce((acc, doc) => {

      if (isValidQualityAccessDoc(doc)) {
        acc[0].push(formatQualityAccessDoc(doc))
      }

      if (isValidAddCritDoc(doc)) {
        acc[1].push(formatAdditionalCriteriaDoc(doc))
      }

      acc[2].push(formatCombinedDataDoc(doc))

      return acc
    }, [[], [], []])

    return {
      combinedData: formattedCombinedDataDocs,
      qualityAccess: {
        htDocs: formattedQualityAccessLastSixMonthsDocs,
        nonHtDocs: formattedQualityAccessLastMonthDocs,
      },
      additionalCriteria: {
        htDocs: formattedAdditionalCriteriaLastSixMonthsDocs,
        nonHtDocs: formattedAdditionalCriteriaLastMonthDocs,
      },
      policyLink: {
        htDocs: formattedPolicyLinkLastSixMonthDocs,
        nonHtDocs: formattedPolicyLinkLastMonthDocs,
      }
    }
  }

  async materializeQualityAccess() {
    const {
      qualityAccess: {
        htDocs,
        nonHtDocs,
      }
    } = this.nonLivesCollectionDocs

    await this.pulseDev
      .collection('payerHistoricalQualityAccess-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalQualityAccess-MATT_TEST')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalQualityAccessHt-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalQualityAccessHt-MATT_TEST')
      .insertMany(htDocs)
  }

  async materializeAdditionalCriteria() {
    const {
      additionalCriteria: {
        htDocs,
        nonHtDocs,
      }
    } = this.nonLivesCollectionDocs

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteria-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteria-MATT_TEST')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteriaHt-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteriaHt-MATT_TEST')
      .insertMany(htDocs)
  }

  async materializePolicyLinks() {
    const {
      policyLink: {
        htDocs,
        nonHtDocs,
      }
    } = this.nonLivesCollectionDocs

    await this.pulseDev
      .collection('payerHistoricalPolicyLinks-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalPolicyLinks-MATT_TEST')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalPolicyLinksHt-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalPolicyLinksHt-MATT_TEST')
      .insertMany(htDocs)
  }

  async materializeCombinedNonLivesData() {
   const { combinedData } = this.nonLivesCollectionDocs

    await this.pulseDev
      .collection('payerHistoricalCombinedData-MATT_TEST')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalCombinedData-MATT_TEST')
      .insertMany(combinedData)
  }

  async materializeNationalDrgLives() {}

  async materializeNationalMmitLives() {}

  async materializeStateDrgLives() {}

  async materializeStateMmitLives() {}

  async materializeRegionalTargetingData() {
    // ! actually materializes the payerCombinedStateLives collection
    const payerHistoricalCombinedData = await this.pulseDev
      .collection('payerHistoricalCombinedData-MATT_TEST')
      .find()
      .toArray()

    await combineLives({
      pulseDevDb: this.pulseDev,
      pulseCoreDb: this.pulseCore,
      payerHistoricalCombinedData,
    })
  }

  async materializeLivesTotals() {
    // ! needs to materialize the following collections:
    // payerDrgNationalLivesTotals
    // payerDrgStateLivesTotals
    // payerMmitNationalLivesTotals
    // payerMmitStateLivesTotals
  }

  /*
    The `syncDrgMmitMedicalLives` script automatically executes on pulse-core whenever MMIT/DRG lives are imported into pulse-core
    (but before the latest month/year MMIT/DRG lives data is pushed to pulse-dev, and before the MMIT/DRG totals collections are calculated).
  */
  async syncDrgMmitMedicalLives() {}

  async materializeNonLivesCollections() {
    this.nonLivesCollectionDocs = await this.getNonLivesCollectionDocs()

    console.log('quality access, additional criteria, policy links, and combined collection docs finished formatting')

    console.log('beginning drop and replace of historical non-lives collections')

    // ! all these guys share the last six months
    // ! only async work they should be doing is
    // ! drop-and-replace their collections
    await Promise.all([
      this.materializeQualityAccess(),
      this.materializeAdditionalCriteria(),
      this.materializePolicyLinks(),
      this.materializeCombinedNonLivesData(),
    ])

    await this.materializeRegionalTargetingData()

    console.log('non-lives historical collections have finished materializing')
  }

  async materializeLivesCollections() {
    await this.syncDrgMmitMedicalLives()

    await Promise.all([
      this.materializeNationalDrgLives,
      this.materializeNationalMmitLives,
      this.materializeStateDrgLives,
      this.materializeStateMmitLives,
      this.materializeLivesTotals,
    ])

    await this.materializeRegionalTargetingData()
  }
}

module.exports = PayerHistoryManager
