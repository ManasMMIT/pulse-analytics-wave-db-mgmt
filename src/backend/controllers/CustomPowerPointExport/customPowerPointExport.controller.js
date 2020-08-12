const d3 = require('d3-collection')
const fs = require('fs')
const pptxgen = require('pptxgenjs')
const path = require('path')
const _ = require('lodash')

const { deleteFile } = require('./../../utils/fileHandler')
const {
  slideConfig,
  slideText,
  defaultChartData,
  ACCESS_MAP,
  CHART_LABELS_SHORT,
} = require('./slideConfig')

const { accumulateTotal } = require('./utils')
class CustomPowerPointExportController {
  constructor(db) {
    this.db = db

    this.createPowerPointSlide = this.createPowerPointSlide.bind(this)

    this.getQualityOfAccessLivesData = this.getQualityOfAccessLivesData.bind(
      this
    )
    this.getChartData = this.getChartData.bind(this)
    this.apiDownloadPptReport = this.apiDownloadPptReport.bind(this)
  }

  async getChartData(groupedQoa) {
    let chartData = defaultChartData.map(({ name, labels }) => {
      let coverageByLives = []

      labels.forEach((label) => {
        const indication = groupedQoa[name]

        if (indication) {
          const percent = indication[label] || 0
          coverageByLives.push(percent)
        } else {
          coverageByLives.push(0)
        }
      })

      return {
        name,
        labels,
        values: coverageByLives,
      }
    })

    const notAuditedResults = chartData
      .reduce(accumulateTotal, [0, 0, 0, 0, 0])
      .map((result) => 1 - result)

    chartData.push({
      name: 'Not Audited',
      labels: CHART_LABELS_SHORT,
      values: notAuditedResults,
    })

    chartData = chartData.map(({ labels, ...rest }) => ({
      ...rest,
      labels: CHART_LABELS_SHORT,
    }))

    const percentCoveredLabels = chartData
      .slice(-2)
      .reduce(accumulateTotal, [0, 0, 0, 0, 0])
      .map((result) => 1 - result)
      .reverse()

    return {
      chartData,
      percentCoveredLabels,
    }
  }

  async getQualityOfAccessLivesData(book) {
    const queryPredicate = {
      indication: {
        $in: ['Asthma', 'Atopic Dermatitis', 'Nasal Polyps'],
      },
      regimen: 'Dupixent',
      population: {
        $in: ['Adult', 'Corticosteroid-Dependent', 'Eosinophilic', 'Pediatric'],
      },
      book,
      coverage: 'Pharmacy',
    }

    const getAccessValues = this.db
      .collection('payerHistoricalQualityAccess')
      .find(queryPredicate)
      .toArray()

    const getLatestLives = this.db
      .collection('payerLatestLives')
      .find({
        book,
        coverage: 'Pharmacy',
        territoryType: 'National',
        source: 'MMIT',
      })
      .toArray()

    const [accessValues, latestLives] = await Promise.all([
      getAccessValues,
      getLatestLives,
    ])

    const groupedLives = _.keyBy(latestLives, 'slug')

    const accountNum = _.uniqBy(accessValues, 'slug').length
    const groupedQoa = d3
      .nest()
      .key((row) => ACCESS_MAP[row.access])
      .key((row) => `${row.indication}, ${row.population}`)
      .rollup((arrOfPayers) => {
        const aggregateLives = arrOfPayers.reduce((acc, payer) => {
          const livesObj = groupedLives[payer.slug] || {}
          const { livesPercent = 0 } = livesObj
          return acc + livesPercent
        }, 0)
        return aggregateLives
      })
      .object(accessValues)

    return {
      groupedQoa,
      accountNum,
    }
  }

  async createPowerPointSlide({
    chartData,
    percentCoveredLabels,
    accountNum,
    book,
  }) {
    let pptx = new pptxgen()
    let slide = pptx.addSlide()
    pptx.layout = 'LAYOUT_4x3'

    slide.addText(slideText.title(book), slideConfig.title)
    slide.addText(slideText.chartTitle(book), slideConfig.chartTitle)
    slide.addText(
      slideText.chartSubtitle({ accountNum, book }),
      slideConfig.chartSubtitle
    )

    slide.addChart(pptx.charts.BAR, chartData, slideConfig.barChart)

    let labelPos = 2.9
    percentCoveredLabels.forEach((decimal, idx) => {
      slide.addText(`~${(decimal * 100).toFixed(0)}% Covered`, {
        x: 0.1,
        y: labelPos,
        fontFace: 'Arial (Body)',
        fontSize: 10,
        italic: true,
        color: '00745A',
      })
      labelPos += 0.65
    })

    slide.addText(slideText.caption, slideConfig.caption)

    slide.addText(slideText.textLegend, slideConfig.textLegend)
    slide.addText(slideText.footNote, slideConfig.footNote)

    const filename = 'dupixent_report.pptx'
    const filePath = path.resolve(__dirname, filename)

    await pptx.writeFile(filePath)

    return {
      filename,
      filePath,
    }
  }

  async apiDownloadPptReport(req, res) {
    try {
      const { book } = req.query
      const { groupedQoa, accountNum } = await this.getQualityOfAccessLivesData(
        book
      )
      const { chartData, percentCoveredLabels } = await this.getChartData(
        groupedQoa
      )

      const { filename, filePath } = await this.createPowerPointSlide({
        chartData,
        percentCoveredLabels,
        accountNum,
        book,
      })

      res.writeHead(200, {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-disposition': `attachment filename=${filename}`,
        'Access-Control-Expose-Headers': 'Content-Disposition',
      })

      const readStream = fs.createReadStream(filePath)

      readStream.on('open', () => {
        readStream.pipe(res)
      })

      readStream.on('close', () => {
        readStream.destroy()
        deleteFile(filePath)
      })

      readStream.on('error', (err) => {
        res.end(err)
      })
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  }
}

module.exports = CustomPowerPointExportController
