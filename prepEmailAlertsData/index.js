const connectToMongoDb = require('../connect-to-mongodb')
const { getScriptTerminator } = require('../utils')

const consolidateAlertSheets = require('./consolidateAlertSheets')
const updateTeamPermissions = require('./updateTeamPermissions')
const filterTeamAlertsByPermissions = require('./filterTeamAlertsByPermissions')

/*
  * * PLAN OF ATTACK * *
  STEP 1:
    Consolidate all of the alerts from `pathwaysKeyEvents, `providers`, `protocols`, `payerLives`
    and `pathwaysInfluencers` sheet into the `alerts` collection

  STEP 2:
    Fetch permissions from auth0 to update pathways permissions for celgene teams

  STEP 3:   
    Filter the alerts collection created in step 1 by the permissions fetched
    for the celgene team in step 2
*/

const prepEmailAlertsData = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')
  
  try {
    await consolidateAlertSheets({ pulseDevDb, mongoConnection, terminateScript })
    await updateTeamPermissions({ pulseDevDb, mongoConnection })
    await filterTeamAlertsByPermissions({ pulseDevDb, mongoConnection })
  } catch (e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

prepEmailAlertsData()
