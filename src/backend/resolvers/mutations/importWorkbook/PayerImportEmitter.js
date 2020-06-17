const { ObjectId } = require('mongodb')
const format = require('date-fns/format')
const { zonedTimeToUtc } = require('date-fns-tz')
const DEFAULT_TIMEZONE = require('../../../utils/defaultTimeZone')

const SOCKET_EMIT_ID = 'PAYER_DATA_IMPORT'

// ! IF YOU WANTED TO LITERALLY ENFORCE SINGLE OP: 
// ! Use global variable to ensure only one job possible at a time
// let timeIntervalId = null

class PayerImportEmitter {
  constructor({ 
    io, 
    pulseCoreDb, 
    user, 
    projectTimestamp, 
    projectId,
  }) {
    this.timeIntervalId = null
    this.io = io
    this.pulseCoreDb = pulseCoreDb
    this.username = user.username
    this.projectId = ObjectId(projectId)
    this.projectName = null
    this.projectTimestamp = format(
      zonedTimeToUtc(projectTimestamp, DEFAULT_TIMEZONE), 
      'M/d/yy'
    )
  }

  async start() {
    const { name: projectName } = await this.pulseCoreDb.collection('tdgProjects')
      .findOne({ _id: this.projectId })

    this.projectName = projectName

    let message = ''
    const startTime = new Date()
    const jobStartTime = startTime.toLocaleString()

    message += jobStartTime
    message += '\n'
    message += `${this.username} is importing `
    message += `${this.projectName} ${this.projectTimestamp} data.`

    this.timeIntervalId = setInterval(() => {
      const elapsedTimeText = `${Math.floor((new Date() - startTime) / 1000)}s elapsed`
      const messageWithElapsedTime = message + ' ' + elapsedTimeText

      console.log(`Payer data import still in progress: ${elapsedTimeText}`)
      this.io.emit(SOCKET_EMIT_ID, messageWithElapsedTime)
    }, 1000)
  }

  error() {
    clearInterval(this.timeIntervalId)

    let message = ''
    const jobEndTime = new Date().toLocaleString()

    message += jobEndTime
    message += '\n'
    message += `${this.username} encountered error while importing `
    message += `${this.projectName} ${this.projectTimestamp} data.`

    console.log('Payer Data Import: emitting error message')
    this.io.emit(SOCKET_EMIT_ID, message)
  }

  success() {
    clearInterval(this.timeIntervalId)

    let message = ''
    const jobEndTime = new Date().toLocaleString()

    message += jobEndTime
    message += '\n'
    message += `${this.username} finished importing `
    message += `${this.projectName} ${this.projectTimestamp} data.`

    console.log('Payer Data Import: emitting success message')
    this.io.emit(SOCKET_EMIT_ID, message)
  }
}

module.exports = PayerImportEmitter
