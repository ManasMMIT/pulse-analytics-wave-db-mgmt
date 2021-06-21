// ! IF YOU WANTED TO LITERALLY ENFORCE SINGLE OP: 
// ! Use global variable to ensure only one job possible at a time
// let timeIntervalId = null

class SurveyImportEmitter {
  timeIntervalId: any
  io: any
  projectName: string
  socketEmitId: string
  emitMessage: string

  constructor(
    io: any,
    projectName: string,
    socketEmitId: string,
  ) {
    this.timeIntervalId = null
    this.io = io
    this.projectName = projectName
    this.socketEmitId = socketEmitId
    this.emitMessage = ''
  }

  async start() {
    const startTime = new Date()

    this.timeIntervalId = setInterval(() => {
      const elapsedTimeText = `${Math.floor((new Date().getTime() - startTime.getTime()) / 1000)}s elapsed`
      const messageWithElapsedTime = `${this.emitMessage || this.projectName}: ${elapsedTimeText}`

      console.log(`${this.projectName} still in progress: ${elapsedTimeText}\n${this.emitMessage}`)
      this.io.emit(this.socketEmitId, messageWithElapsedTime)
    }, 1000)
  }

  emit(message) {
    this.emitMessage = message
  }

  error() {
    clearInterval(this.timeIntervalId)
    console.log(`Error ${this.projectName}.`)
    this.io.emit(this.socketEmitId, `error ${this.projectName}`)
  }

  success() {
    clearInterval(this.timeIntervalId)
    console.log(`Finished ${this.projectName}.`)
    this.io.emit(this.socketEmitId, `finished ${this.projectName}`)
  }
}

export default SurveyImportEmitter
