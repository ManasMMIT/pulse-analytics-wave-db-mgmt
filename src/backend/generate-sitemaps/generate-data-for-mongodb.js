const _ = require('lodash')

const processUsersNodesResources = require('./process-users-nodes-resources')
const processUsersSitemaps = require('./process-users-sitemaps')

const generateDataForMongoDb = async ({
  sequelize,
  models: {
    User,
    Role,
    Node,
    RoleNode,
    RegionalBreakdown,
    Resource,
  }
}) => {
  const { usersSitemaps, rolesSitemaps } = await processUsersSitemaps({
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
    rolesSitemaps,
    usersSitemaps,
    usersNodesResources,
  }
}

module.exports = generateDataForMongoDb
