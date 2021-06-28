import updateRoleData from './updateRoleData'
import updateProviderData from './updateProviderData'

async function updateMarketBasketSurveyAnswers(pulseDevDb: any, updatedPerson: any) {
  await updateRoleData(pulseDevDb, updatedPerson)
  await updateProviderData(pulseDevDb, updatedPerson)
}

export default updateMarketBasketSurveyAnswers
