/*
  Plan of Attack:
  1. Setup workbook import on polaris frontend
  2. Make sure this resolver is hit, backed by solid typedefs
  3. Architect out structure of pipeline with stubbed methods and directories
  4. Decide how to split up PRs
*/

// TODO: Remember to define return type of resolver,
// *** once it's clear what will be returned

const importMarketBasketSurvey = async (
  parent,
  { input }, // ? need marketBasketId, surveyId, data
  { pulseCoreDb, pulseDevDb, mongoClient, io, user },
  info
) => {

}

export default importMarketBasketSurvey
