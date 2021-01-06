const fs = require('fs')
const pptxgen = require('pptxgenjs')
const path = require('path')

const { deleteFile } = require('./../../utils/fileHandler')
const {
  AccessAcrossIndicationSlide,
  AccessSummaryTopPayersSlide,
} = require('./slides')

class CustomPowerPointExportController {
  constructor(db) {
    this.db = db

    this.createSlides = this.createSlides.bind(this)
    this.apiDownloadPptReport = this.apiDownloadPptReport.bind(this)
  }

  async createSlides({ pptx, book }) {
    const { db } = this

    // Create Slides
    const accessIndicationSlide = new AccessAcrossIndicationSlide({ db, book })
    const accessSummaryTopPayersSlide = new AccessSummaryTopPayersSlide({ db })

    await accessIndicationSlide.createPowerPointSlide(pptx)
    await accessSummaryTopPayersSlide.createPowerPointSlide(pptx)
  }

  async apiDownloadPptReport(req, res) {
    try {
      const { book } = req.query
      let pptx = new pptxgen()
      pptx.layout = 'LAYOUT_4x3'
      const filename = 'dupixent_report.pptx'
      const filePath = path.resolve(__dirname, filename)

      await this.createSlides({ pptx, book })
      await pptx.writeFile(filePath)

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
