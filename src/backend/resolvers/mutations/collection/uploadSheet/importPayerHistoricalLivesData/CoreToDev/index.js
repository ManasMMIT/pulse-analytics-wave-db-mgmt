const combineLives = require('../../shared/combine-lives')

class CoreToDev {
  constructor({ pulseDev, pulseCore }) {
    this.pulseDev = pulseDev
    this.pulseCore = pulseCore
  }

  async materializeNationalDrgLives() { }

  async materializeNationalMmitLives() { }

  async materializeStateDrgLives() { }

  async materializeStateMmitLives() { }

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
  // async syncDrgMmitMedicalLives() { }

  async materializeLivesCollections() {
    // ! actually belongs in sheet to core import logic
    // await this.syncDrgMmitMedicalLives()

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
