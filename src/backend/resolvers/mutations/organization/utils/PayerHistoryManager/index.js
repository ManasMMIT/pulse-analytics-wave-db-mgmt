class PayerHistoryManager {
  constructor({ pulseDev, pulseCore }) {
    this.pulseDev = pulseDev
    this.pulseCore = pulseCore

    this.lastSixMonthsOrgTpHistory = null
  }

  // following materialize two collections each: latest month and latest six months
  // ! if (!this.lastSixMonthsOrgTpHistory), then they'll need to fetch their own historical data,
  // ! if it does exist, it's because they were probably called all together.
  async getLastSixMonthsOrgTpHistory() {}

  async materializeQualityAccess() {}

  async materializePolicyLinks() {}

  async materializeAdditionalCriteria() {}

  async materializeCombinedNonLivesData() {
  /*
    if we take organizations.treatmentPlans.history and we group by orgTpId and slice off the most recent doc in each grouping and then rejoin everything, we should theoretically get total number of docs close to payerHistoricalCombinedData
  */
  }

  async materializeNationalDrgLives() {}

  async materializeNationalMmitLives() {}

  async materializeStateDrgLives() {}

  async materializeStateMmitLives() {}

  async materializeRegionalTargetingData() {
    // actually materializes the payerCombinedStateLives collection
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
    this.lastSixMonthsOrgTpHistory = await this.getLastSixMonthsOrgTpHistory()

    // ! all these guys share the last six months
    // ! only async work they should be doing is
    // ! drop-and-replace their collections
    await Promise.all([
      this.materializeQualityAccess,
      this.materializePolicyLinks,
      this.materializeAdditionalCriteria,
      this.materializeCombinedNonLivesData,
    ])

    await this.materializeRegionalTargetingData()
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
