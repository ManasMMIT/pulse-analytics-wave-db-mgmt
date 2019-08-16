const express = require('express')

const generateSitemaps = require('../generate-sitemaps')

module.exports = ({
  // auth0
  auth0,

  // mongo guys
  mongoClient,
  pulseDevDb,
  pulseCoreDb,
  pulseProdDb,

  mongoUsers,
  mongoRoles,
  mongoClients,

  // psql stuff
  sequelize,
  User,
  Role,
  Client,
  Node,
  RoleNode,
  RegionalBreakdown,
  Resource,
}) => {
  const subApp = express()

  subApp.get('/:roleId', async ({
    params: { roleId },
  }, res) => {
    const role = await mongoRoles.findOne({ _id: roleId })
    const sitemap = role.sitemap ? role.sitemap : {}

    res.json(sitemap)
  })

  subApp.post('/generate', async (req, res, next) => {
    try {
      await generateSitemaps({
        mongoClient,
        pulseCoreDb,
        pulseDevDb,
        pulseProdDb,
        psqlProps: {
          sequelize,
          models: {
            User,
            Role,
            Node,
            RoleNode,
            RegionalBreakdown,
            Resource,
          }
        },
      })
    } catch (e) {
      next(e)
      return
    }

    res.json({ success: true, __typename: 'successMessage' })
  })

  return subApp
}
