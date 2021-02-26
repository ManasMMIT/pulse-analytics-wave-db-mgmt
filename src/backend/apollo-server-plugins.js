const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const logWriteStream = fs.createWriteStream(
  path.join(__dirname, '/logs/api.log'),
  {
    flags: 'a',
  }
)

module.exports = [
  {
    requestDidStart() {
      return {
        willSendResponse(requestContext) {
          const isMutationRequest =
            requestContext.operation.operation === 'mutation'

          if (isMutationRequest) {
            const {
              context: {
                user: { username, user_id },
              },
              request: { operationName, variables },
              errors,
            } = requestContext

            const cleanedVariables = cleanVariables(variables, operationName)

            let entryToLog = `username: ${username} / userId: ${user_id} / operationName: ${operationName} / operationVariables: ${JSON.stringify(
              cleanedVariables
            )}`

            if (_.isEmpty(errors)) {
              entryToLog = `status: SUCCESS / ` + entryToLog
            } else {
              entryToLog = `status: ERROR / ` + entryToLog
            }

            entryToLog = `[${new Date().toISOString()}] ` + entryToLog + '\n\n'

            logWriteStream.write(entryToLog)
          }
        },
      }
    },
  },
]

const cleanVariables = (variables, operationName) => {
  const copyOfVariables = _.cloneDeep(variables)

  if (copyOfVariables.input) {
    // ! Don't persist passwords in nested input
    if (copyOfVariables.input.password) copyOfVariables.input.password = true

    // ! Don't persist huge amounts of workbook data in the oplog,
    // ! also results in VERY heavy reads
    if (operationName === 'ImportWorkbook') {
      copyOfVariables.input.forEach((workbookObj) => {
        workbookObj.data = []
      })
    } else if (operationName === 'UpdateRoleSitemap') {
      copyOfVariables.input.updatedSitemap = {}
    } else if (operationName === 'UpdatePermissions') {
      copyOfVariables.input.updatedResources = {}
    }
  }

  return copyOfVariables
}
