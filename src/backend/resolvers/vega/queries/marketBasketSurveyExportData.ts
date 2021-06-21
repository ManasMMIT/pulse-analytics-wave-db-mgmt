import axios from 'axios'

const marketBasketSurveyExportData = async (
  parent,
  { surveyId },
  context,
  info
) => {
  return axios
    .get(`market-basket-surveys/${surveyId}/export_template`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })
}

export default marketBasketSurveyExportData
