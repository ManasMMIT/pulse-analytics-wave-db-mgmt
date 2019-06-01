const _ = require('lodash')
const initializeTables = require('./initialize-tables')

const processUsersNodesResources = require('./process-users-nodes-resources')
const processUsersSitemaps = require('./process-users-sitemaps')

const generateDataForMongoDb = async () => {
  const {
    sequelize,
    models: {
      User,
      Role,
      Node,
      RoleNode,
      RegionalBreakdown,
      Resource,
    }
  } = await initializeTables()

  const usersSitemaps = await processUsersSitemaps({
    sequelize,
    User,
    Role,
    Node,
  })

  // get users.nodes.resources
  const rawUsersNodesResources = await User.findAll(
    {
      duplicating: true,
      required: true,
      include: [
        {
          model: Role,
          through: { attributes: [] },
          duplicating: true,
          required: true,
          include: [
            {
              model: RoleNode,
              duplicating: true,
              required: true,
              include: [
                {
                  model: Resource,
                  duplicating: true,
                  required: true,
                  include: [
                    {
                      model: RegionalBreakdown,
                      as: 'regionalBreakdown',
                      duplicating: true,
                      required: true,
                      include: [
                        {
                          model: sequelize.models.us_states_regions,
                          duplicating: true,
                          required: true,
                          as: 'bsr',
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
        },
      ],
    },
  )

  const allStates = await sequelize.models.us_state.findAll()
  const allRegions = await sequelize.models.region.findAll()
  const statesByKey = _.keyBy(allStates, 'id')
  const regionsByKey = _.keyBy(allRegions, 'id')

  const usersNodesResources = processUsersNodesResources({
    rawUsersNodesResources,
    statesByKey,
    regionsByKey,
  })

  return {
    usersSitemaps,
    usersNodesResources,
  }
}

module.exports = generateDataForMongoDb
