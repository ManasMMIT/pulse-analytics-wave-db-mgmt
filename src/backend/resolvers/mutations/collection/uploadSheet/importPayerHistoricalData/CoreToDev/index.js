const combineLives = require('./combine-lives')
const additionalCriteriaAggPip = require('./agg-pipelines/additional-criteria-ptp-pipeline')
const qualityAccessAggPip = require('./agg-pipelines/quality-access-agg-pip')
const policyLinkAggPipeline = require('./agg-pipelines/policy-link-agg-pipeline')

const {
  formatQualityAccessDoc,
  formatCombinedDataDoc,
} = require('./formatters')

class CoreToDev {
  constructor({ pulseDev, pulseCore }) {
    this.pulseDev = pulseDev
    this.pulseCore = pulseCore

    this.nonLivesCollectionDocs = null
  }

  async getNonLivesCollectionDocs() {
    console.log('grabbing payer historical data')

    const qualityAccessSixMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        qualityAccessAggPip(6),
        { allowDiskUse: true }
      )
      .toArray()

    const additCritSixMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        additionalCriteriaAggPip(6),
        { allowDiskUse: true }
      )
      .toArray()

    const qualityAccessOneMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        qualityAccessAggPip(1),
        { allowDiskUse: true }
      )
      .toArray()

    const addCritOneMonthOp = this.pulseCore
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        additionalCriteriaAggPip(1),
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
      qualityAccessLastSixMonthDocs,
      additCritLastSixMonthDocs,
      qualityAccessLastMonthDocs,
      additCritLastMonthDocs,
      formattedPolicyLinkLastSixMonthDocs, // payer link agg pipeline already formats this, weeds out null links
      formattedPolicyLinkLastMonthDocs,  // payer link agg pipeline already formats this, weeds out null links
    ] = await Promise.all([
      qualityAccessSixMonthOp,
      additCritSixMonthOp,
      qualityAccessOneMonthOp,
      addCritOneMonthOp,
      policyLinkSixMonthOp,
      policyLinkOneMonthOp,
    ])

    console.log('formatting docs to write to payer collections')

    const formattedQualityAccessLastSixMonthsDocs = qualityAccessLastSixMonthDocs
      .map(formatQualityAccessDoc)

    const [
      formattedQualityAccessLastMonthDocs,
      formattedCombinedDataDocs,
    ] = qualityAccessLastMonthDocs.reduce((acc, doc) => {

      acc[0].push(formatQualityAccessDoc(doc))

      acc[1].push(formatCombinedDataDoc(doc))

      return acc
    }, [[], []])

    return {
      combinedData: formattedCombinedDataDocs,
      qualityAccess: {
        htDocs: formattedQualityAccessLastSixMonthsDocs,
        nonHtDocs: formattedQualityAccessLastMonthDocs,
      },
      additionalCriteria: {
        htDocs: additCritLastSixMonthDocs,
        nonHtDocs: additCritLastMonthDocs,
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
      .collection('payerHistoricalQualityAccess')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalQualityAccess')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalQualityAccessHt')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalQualityAccessHt')
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
      .collection('payerHistoricalAdditionalCriteria')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteria')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteriaHt')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalAdditionalCriteriaHt')
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
      .collection('payerHistoricalPolicyLinks')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalPolicyLinks')
      .insertMany(nonHtDocs)

    await this.pulseDev
      .collection('payerHistoricalPolicyLinksHt')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalPolicyLinksHt')
      .insertMany(htDocs)
  }

  async materializeCombinedNonLivesData() {
   const { combinedData } = this.nonLivesCollectionDocs

    await this.pulseDev
      .collection('payerHistoricalCombinedData')
      .deleteMany()

    await this.pulseDev
      .collection('payerHistoricalCombinedData')
      .insertMany(combinedData)
  }

  async materializeNationalDrgLives() {}

  async materializeNationalMmitLives() {}

  async materializeStateDrgLives() {}

  async materializeStateMmitLives() {}

  async materializeRegionalTargetingData() {
    await combineLives({
      pulseDevDb: this.pulseDev,
      pulseCoreDb: this.pulseCore,
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

module.exports = CoreToDev
