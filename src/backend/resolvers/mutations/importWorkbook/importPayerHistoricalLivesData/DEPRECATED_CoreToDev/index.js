const _ = require('lodash')

const {
  getNationalLivesTotalsAggPip,
  getStateLivesTotalsAggPip,
  getPayerStateLivesAggPip,
  getPayerNationalLivesAggPip,
} = require('./agg-pipelines')

const {
  STATE_LONG_BY_ABBREV,
} = require('../../../../../utils/states-data-util')

class CoreToDev {
  constructor({ pulseDev, pulseCore }) {
    this.pulseDev = pulseDev
    this.pulseCore = pulseCore
  }

  async getNationalLivesTotals(source) {
    return await this.pulseCore
      .collection('lives.history')
      .aggregate(getNationalLivesTotalsAggPip(source), { allowDiskUse: true })
      .toArray()
  }

  combineBookCoverageLives(bookCoverageLivesDocs, shouldTotal = true) {
    return bookCoverageLivesDocs.reduce((acc, { book, coverage, lives }) => {
      const bookCoverageKey = _.camelCase(`${book}${coverage}`)

      acc[bookCoverageKey] = lives

      if (shouldTotal) {
        let totalKey = `total${coverage}`

        acc[totalKey] ? (acc[totalKey] += lives) : (acc[totalKey] = lives)
      }

      return acc
    }, {})
  }

  async materializePayerDrgNationalLivesTotals() {
    const payerDrgNationalLivesTotalCollection = this.pulseCore.collection(
      'payerDrgNationalLivesTotals-MATT'
    )

    await payerDrgNationalLivesTotalCollection.deleteOne()

    const payerDrgNationalLivesTotals = await this.getNationalLivesTotals('DRG')

    const payerDrgNationalLivesTotalsDoc = this.combineBookCoverageLives(
      payerDrgNationalLivesTotals
    )

    await payerDrgNationalLivesTotalCollection.insertOne(
      payerDrgNationalLivesTotalsDoc
    )
  }

  async materializePayerMmitNationalLivesTotals() {
    const payerMmitNationalLivesTotalCollection = this.pulseCore.collection(
      'payerMmitNationalLivesTotals-MATT'
    )

    await payerMmitNationalLivesTotalCollection.deleteOne()

    const payerMmitNationalLivesTotals = await this.getNationalLivesTotals(
      'MMIT'
    )

    const payerMmitNationalLivesTotalsDoc = this.combineBookCoverageLives(
      payerMmitNationalLivesTotals
    )

    await payerMmitNationalLivesTotalCollection.insertOne(
      payerMmitNationalLivesTotalsDoc
    )
  }

  async getStateLivesTotals(source) {
    return await this.pulseCore
      .collection('lives.history')
      .aggregate(getStateLivesTotalsAggPip(source), { allowDiskUse: true })
      .toArray()
  }

  formatStateLivesTotalsDoc(stateDocs) {
    return stateDocs.map(({ _id: state, bookCoverageSums }) => {
      const bookCoverageLivesFields = this.combineBookCoverageLives(
        bookCoverageSums
      )

      return {
        state,
        stateLong: STATE_LONG_BY_ABBREV[state],
        ...bookCoverageLivesFields,
      }
    })
  }

  async materializePayerDrgStateLivesTotals() {
    const payerDrgStateLivesTotalCollection = this.pulseCore.collection(
      'payerDrgStateLivesTotals-MATT'
    )

    await payerDrgStateLivesTotalCollection.deleteMany()

    const payerDrgStateLivesTotals = await this.getStateLivesTotals('DRG')

    const payerDrgStateLivesTotalsDoc = this.formatStateLivesTotalsDoc(
      payerDrgStateLivesTotals
    )

    await payerDrgStateLivesTotalCollection.insertMany(
      payerDrgStateLivesTotalsDoc
    )
  }

  async materializePayerMmitStateLivesTotals() {
    const payerMmitStateLivesTotalCollection = this.pulseCore.collection(
      'payerMmitStateLivesTotals-MATT'
    )

    await payerMmitStateLivesTotalCollection.deleteMany()

    const payerMmitStateLivesTotals = await this.getStateLivesTotals('MMIT')

    const payerMmitStateLivesTotalsDoc = this.formatStateLivesTotalsDoc(
      payerMmitStateLivesTotals
    )

    await payerMmitStateLivesTotalCollection.insertMany(
      payerMmitStateLivesTotalsDoc
    )
  }

  async materializeLivesTotals() {
    await Promise.all([
      this.materializePayerDrgNationalLivesTotals(),
      this.materializePayerMmitNationalLivesTotals(),
      this.materializePayerDrgStateLivesTotals(),
      this.materializePayerMmitStateLivesTotals(),
    ])
  }

  async getPayerStateLives(source) {
    return await this.pulseCore
      .collection('lives.history')
      .aggregate(getPayerStateLivesAggPip(source), { allowDiskUse: true })
      .toArray()
  }

  async materializeStateDrgLives() {
    const collection = this.pulseDev.collection(
      'payerHistoricalDrgStateLives-MATT'
    )

    await collection.deleteMany()

    const drgPayerStateLives = await this.getPayerStateLives('DRG')

    const docs = drgPayerStateLives.map(
      ({ bookCoverageLivesDocs, ...rest }) => {
        const bookCoverageLivesFields = this.combineBookCoverageLives(
          bookCoverageLivesDocs
        )

        return {
          ...rest,
          stateLong: STATE_LONG_BY_ABBREV[rest.state],
          ...bookCoverageLivesFields,
          createdOn: new Date(),
        }
      }
    )

    await collection.insertMany(docs)
  }

  async materializeStateMmitLives() {
    const collection = this.pulseDev.collection(
      'payerHistoricalMmitStateLives-MATT'
    )

    await collection.deleteMany()

    const mMitPayerStateLives = await this.getPayerStateLives('MMIT')

    const docs = mMitPayerStateLives.map(
      ({ bookCoverageLivesDocs, ...rest }) => {
        const bookCoverageLivesFields = this.combineBookCoverageLives(
          bookCoverageLivesDocs
        )

        return {
          ...rest,
          stateLong: STATE_LONG_BY_ABBREV[rest.state],
          ...bookCoverageLivesFields,
          createdOn: new Date(),
        }
      }
    )

    await collection.insertMany(docs)
  }

  async getPayerNationalLives(source) {
    return await this.pulseCore
      .collection('lives.history')
      .aggregate(getPayerNationalLivesAggPip(source), { allowDiskUse: true })
      .toArray()
  }

  async materializeNationalDrgLives() {
    const collection = this.pulseDev.collection(
      'payerHistoricalDrgNationalLives-MATT'
    )

    await collection.deleteMany()

    const dRgPayerNationalLives = await this.getPayerNationalLives('DRG')

    const totalsDoc = await this.pulseCore
      .collection('payerDrgNationalLivesTotals')
      .findOne()

    const docs = dRgPayerNationalLives.map(({ structuredLives, ...rest }) => {
      const bookCoverageFields = this.combineBookCoverageLives(
        structuredLives,
        false
      )

      structuredLives = structuredLives.map(({ book, coverage, lives }) => {
        const bookCoverage = _.camelCase(`${book}${coverage}`)

        const livesDenominator = totalsDoc[bookCoverage]

        let livesPercentage = 0
        if (livesDenominator) {
          livesPercentage = lives / livesDenominator
        }

        return {
          book,
          coverage,
          lives,
          livesPercentage,
        }
      })

      return {
        structuredLives,
        ...rest,
        ...bookCoverageFields,
        createdOn: new Date(),
      }
    })

    collection.insertMany(docs)
  }

  async materializeNationalMmitLives() {
    const collection = this.pulseDev.collection(
      'payerHistoricalMmitNationalLives-MATT'
    )

    await collection.deleteMany()

    const mMitPayerNationalLives = await this.getPayerNationalLives('MMIT')

    const totalsDoc = await this.pulseCore
      .collection('payerMmitNationalLivesTotals')
      .findOne()

    const docs = mMitPayerNationalLives.map(({ structuredLives, ...rest }) => {
      const bookCoverageFields = this.combineBookCoverageLives(
        structuredLives,
        false
      )

      structuredLives = structuredLives.map(({ book, coverage, lives }) => {
        const bookCoverage = _.camelCase(`${book}${coverage}`)

        const livesDenominator = totalsDoc[bookCoverage]

        let livesPercentage = 0
        if (livesDenominator) {
          livesPercentage = lives / livesDenominator
        }

        return {
          book,
          coverage,
          lives,
          livesPercentage,
        }
      })

      return {
        structuredLives,
        ...rest,
        ...bookCoverageFields,
        createdOn: new Date(),
      }
    })

    collection.insertMany(docs)
  }

  /*
    ! actually belongs in sheet to core import logic
    The `syncDrgMmitMedicalLives` script automatically executes on pulse-core whenever MMIT/DRG lives are imported into pulse-core
    (but before the latest month/year MMIT/DRG lives data is pushed to pulse-dev, and before the MMIT/DRG totals collections are calculated).
  */
  // async syncDrgMmitMedicalLives() { }

  async materializeLivesCollections() {
    // ! actually belongs in sheet to core import logic
    // await this.syncDrgMmitMedicalLives()

    await this.materializeLivesTotals()

    await Promise.all([
      this.materializeNationalDrgLives(),
      this.materializeNationalMmitLives(),
      this.materializeStateDrgLives(),
      this.materializeStateMmitLives(),
    ])

    console.log('Finished materializing all payer lives collections')
  }
}

module.exports = CoreToDev
