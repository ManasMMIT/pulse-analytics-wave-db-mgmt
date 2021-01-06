const _ = require('lodash')

const { slideConfig, slideText } = require('./slideConfig')
const {
  SHARED_ACCESS_MAP,
  DUPIXENT_REGIMEN,
  ASTHMA_INDICATION,
  ATOPIC_DERMATITIS_INDICATION,
  NASAL_POLYPS_INDICATION,
  EOS_POPULATION,
  CORTICOSTEROID_POPULATION,
  ADULT_POPULATION,
  PEDIATRIC_POPULATION,
  AGES_TWELVE_PLUS_POPULATION,
  AGES_SIX_ELEVEN_POPULATION,
  REGENERON_USER_ID,
  PAYER_ACCOUNTS_TOOL_ID,
} = require('../sharedConfig')

class AccessAcrossIndicationSlide {
  constructor({ db }) {
    this.db = db

    this.createPowerPointSlide = this.createPowerPointSlide.bind(this)

    this.getRegeneronAccounts = this.getRegeneronAccounts.bind(this)
    this.getTopPayersLivesData = this.getTopPayersLivesData.bind(this)
    this.getQualityOfAccessData = this.getQualityOfAccessData.bind(this)
    this.getTableData = this.getTableData.bind(this)
  }

  async getTableData({ livesData, accessData }) {
    const getAccess = ({ slug, indication, population, regimen }) => {
      const key = `${slug}|${indication}|${population}|${regimen}`
      const accessArr = accessData[key]

      if (!accessArr || !SHARED_ACCESS_MAP[accessArr[0].access])
        return SHARED_ACCESS_MAP['Not Audited']

      return SHARED_ACCESS_MAP[accessArr[0].access]
    }

    const tableData = livesData.map(
      ({ organizationTiny, slug, livesPercent }) => {
        const formattedLivesPercent = livesPercent.toLocaleString('en', {
          style: 'percent',
          minimumFractionDigits: 1,
        })
        const eosAsthmaAccess = getAccess({
          slug,
          indication: ASTHMA_INDICATION,
          population: EOS_POPULATION,
          regimen: DUPIXENT_REGIMEN,
        })

        const ocsAsthmaAccess = getAccess({
          slug,
          indication: ASTHMA_INDICATION,
          population: CORTICOSTEROID_POPULATION,
          regimen: DUPIXENT_REGIMEN,
        })

        const adAccess = getAccess({
          slug,
          indication: ATOPIC_DERMATITIS_INDICATION,
          population: AGES_TWELVE_PLUS_POPULATION,
          regimen: DUPIXENT_REGIMEN,
        })

        const pediatricAdAccess = getAccess({
          slug,
          indication: ATOPIC_DERMATITIS_INDICATION,
          population: AGES_SIX_ELEVEN_POPULATION,
          regimen: DUPIXENT_REGIMEN,
        })

        const nasalPolypsAccess = getAccess({
          slug,
          indication: NASAL_POLYPS_INDICATION,
          population: ADULT_POPULATION,
          regimen: DUPIXENT_REGIMEN,
        })

        return [
          { text: organizationTiny },
          { text: formattedLivesPercent },
          {
            text: eosAsthmaAccess.commonAccess,
            options: {
              fill: eosAsthmaAccess.tableColor,
            },
          },
          {
            text: ocsAsthmaAccess.commonAccess,
            options: {
              fill: ocsAsthmaAccess.tableColor,
            },
          },
          {
            text: adAccess.commonAccess,
            options: {
              fill: adAccess.tableColor,
            },
          },
          {
            text: pediatricAdAccess.commonAccess,
            options: {
              fill: pediatricAdAccess.tableColor,
            },
          },
          {
            text: nasalPolypsAccess.commonAccess,
            options: {
              fill: nasalPolypsAccess.tableColor,
            },
          },
        ]
      }
    )

    return tableData
  }

  async getTopPayersLivesData(regeneronAccountSlugs) {
    const topPayerLives = await this.db
      .collection('payerLatestLives')
      .aggregate([
        {
          $match: {
            book: 'Commercial',
            source: 'MMIT',
            coverage: 'Pharmacy',
            territoryType: 'National',
            slug: {
              $in: regeneronAccountSlugs,
            },
          },
        },
        {
          $lookup: {
            from: 'payers',
            localField: 'slug',
            foreignField: 'slug',
            as: 'orgInfo',
          },
        },
        {
          $unwind: { path: '$orgInfo' },
        },
        {
          $project: {
            livesPercent: 1,
            lives: 1,
            slug: 1,
            organizationTiny: '$orgInfo.organizationTiny',
          },
        },
        {
          $sort: {
            lives: -1,
          },
        },
        {
          $limit: 25,
        },
      ])
      .toArray()

    return topPayerLives
  }

  async getQualityOfAccessData(topPayerLives) {
    const topPayerSlugs = topPayerLives.map(({ slug }) => slug)
    const accessData = await this.db
      .collection('payerLatestAccess')
      .aggregate([
        {
          $match: {
            indication: {
              $in: [
                ASTHMA_INDICATION,
                ATOPIC_DERMATITIS_INDICATION,
                NASAL_POLYPS_INDICATION,
              ],
            },
            population: {
              $in: [
                EOS_POPULATION,
                CORTICOSTEROID_POPULATION,
                AGES_SIX_ELEVEN_POPULATION,
                AGES_TWELVE_PLUS_POPULATION,
                ADULT_POPULATION,
                PEDIATRIC_POPULATION,
              ],
            },
            regimen: DUPIXENT_REGIMEN,
            slug: {
              $in: topPayerSlugs,
            },
            book: 'Commercial',
            coverage: 'Pharmacy',
          },
        },
        {
          $project: {
            slug: '$slug',
            indication: '$indication',
            population: '$population',
            regimen: '$regimen',
            access: '$accessData.access',
          },
        },
      ])
      .toArray()

    const groupedAccessData = _.groupBy(
      accessData,
      ({ slug, indication, population, regimen }) =>
        `${slug}|${indication}|${population}|${regimen}`
    )
    return groupedAccessData
  }

  async getRegeneronAccounts() {
    const [accounts] = await this.db
      .collection('users.nodes.resources')
      .aggregate([
        {
          $match: {
            _id: REGENERON_USER_ID,
          },
        },
        {
          $unwind: {
            path: '$resources',
          },
        },
        {
          $match: {
            'resources.nodeId': PAYER_ACCOUNTS_TOOL_ID,
          },
        },
        {
          $project: {
            slugs: '$resources.accounts.slug',
          },
        },
      ])
      .toArray()

    const accountSlugs = accounts.slugs

    return accountSlugs
  }

  async createPowerPointSlide(pptx) {
    const regeneronAccountSlugs = await this.getRegeneronAccounts()
    const topPayerLives = await this.getTopPayersLivesData(
      regeneronAccountSlugs
    )
    const accessData = await this.getQualityOfAccessData(topPayerLives)

    const tableData = await this.getTableData({
      livesData: topPayerLives,
      accessData,
    })

    let slide = pptx.addSlide()

    slide.addText(slideText.title, slideConfig.title)
    slide.addText(slideText.chartTitle, slideConfig.chartTitle)
    slide.addText(slideText.chartSubtitle, slideConfig.chartSubtitle)

    let rows = [slideText.tableHeader, ...tableData]
    slide.addTable(rows, slideConfig.table)

    slide.addText(slideText.textLegend, slideConfig.textLegend)
    slide.addText(slideText.footNote, slideConfig.footNote)
  }
}

module.exports = AccessAcrossIndicationSlide
