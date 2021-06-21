import validateSurveyData from './validateSurveyData'
import upsertRelationalData from './upsertRelationalData'
import materializeData from './materializeData'
import SurveyImportEmitter from './SurveyImportEmitter'

const PROJECT_NAME = 'importing market basket survey data'
const SOCKET_PROJECT_ID = 'IMPORT_MB_SURVEY_DATA'

const importMarketBasketSurvey = async (
  parent,
  { input },
  { io, pulseDevDb },
  info
) => {
  const socketEmitId = `${SOCKET_PROJECT_ID}_${input.surveyId}`
  const socket = new SurveyImportEmitter(io, PROJECT_NAME, socketEmitId)

  socket.start()

  try {
    await validateSurveyData({ ...input, socket })
    upsertRelationalData({ ...input, socket })
      .then(() => materializeData({ ...input, pulseDevDb, socket }))
      .then(() => socket.success())
  } catch (e) {
    socket.error()
    throw new Error(e)
  }


  return 'done'
}

export default importMarketBasketSurvey
