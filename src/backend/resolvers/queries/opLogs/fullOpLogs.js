const lineReader = require('reverse-line-reader')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

// readFirstLine is from https://github.com/pensierinmusica/firstline/blob/master/index.js
const readFirstLine = (path, usrOpts) => {
  const opts = {
    encoding: 'utf8',
    lineEnding: '\n',
  }
  Object.assign(opts, usrOpts)
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path, { encoding: opts.encoding })
    let acc = ''
    let pos = 0
    let index
    rs.on('data', (chunk) => {
      index = chunk.indexOf(opts.lineEnding)
      acc += chunk
      if (index === -1) {
        pos += chunk.length
      } else {
        pos += index
        rs.close()
      }
    })
      .on('close', () =>
        resolve(acc.slice(acc.charCodeAt(0) === 0xfeff ? 1 : 0, pos))
      )
      .on('error', (err) => reject(err))
  })
}

const fullOpLogs = async (
  parent,
  { maxLineCount = 20 },
  { coreNodes, coreRoles },
  info
) => {
  const pathToLog = path.join(process.cwd(), 'src', 'backend', 'api.log')

  if (!fileExists(pathToLog)) return []

  // if first line is blank, log must be empty, which would cause breakage for lineReader
  const firstLine = await readFirstLine(pathToLog)
  if (firstLine === '') return []

  let nodes = await coreNodes.find().toArray()
  let teams = await coreRoles.find().toArray()
  nodes = _.keyBy(nodes, '_id')
  teams = _.keyBy(teams, '_id')

  const getOpLogsSinceLastPush = new Promise((resolve, reject) => {
    const ops = []
    let lineCount = 0

    try {
      lineReader.eachLine(pathToLog, (line, isLastLine) => {
        if (line !== '') {
          let timestamp = line.match(/\[(.+?)\]/)[1]
          let username = line.match(/username: (.+?) \//)[1]
          let userId = line.match(/userId: (.+?) \//)[1]
          let operationName = line.match(/operationName: (.+?) \//)[1]
          let operationVariables = line.match(/operationVariables: (.+)/)[1]

          let statusMatch = line.match(/status: (.+?) \//)
          let status = statusMatch && statusMatch[1]

          operationVariables = JSON.parse(operationVariables)

          if (operationName === 'UpdatePermissions') {
            const { nodeId, teamId } = operationVariables.input
            const nodeStillExists = Boolean(nodes[nodeId])
            const teamStillExists = Boolean(teams[teamId])

            let nodeName = 'deleted'
            let nodeType = 'deleted'
            if (nodeStillExists) {
              const node = nodes[nodeId]

              nodeName = node.name
              nodeType = node.type
            }

            let teamName = 'deleted'
            let clientName = ''
            if (teamStillExists) {
              const team = teams[teamId]
              teamName = team.name
              clientName = team.client.name
            }

            operationVariables = {
              input: {
                node: { nodeName, nodeType },
                team: { teamName, clientName },
              },
            }
          }

          if (operationName === 'UpdateRoleSitemap') {
            const { teamId } = operationVariables.input
            const teamStillExists = Boolean(teams[teamId])

            let teamName = 'deleted'
            let clientName = ''
            if (teamStillExists) {
              const team = teams[teamId]
              teamName = team.name
              clientName = team.client.name
            }

            operationVariables = {
              input: {
                team: { teamName, clientName },
              },
            }
          }

          // ! ignore 'FilterQuery' mutations that aren't actually CUD (and also are going to be deprecated)
          if (operationName !== 'FilterQuery') {
            ops.push({
              timestamp,
              username,
              userId,
              operationName,
              operationVariables,
              status,
            })
          }

          lineCount += 1
        }

        // Stop reading the file from the end either when you reach last line or when you
        // hit the maxLineCount passed to the resolver
        if (lineCount === maxLineCount || isLastLine) {
          resolve(ops)
          return false
        }
      })
    } catch (e) {
      reject(e)
    }
  })

  const result = await getOpLogsSinceLastPush

  return result
}

module.exports = fullOpLogs
