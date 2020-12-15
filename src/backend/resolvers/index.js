const GraphQLJSON = require('graphql-type-json')
const {
  GraphQLDate,
  // GraphQLTime,
  GraphQLDateTime,
} = require('graphql-iso-date')

const queries = require('./queries')
const mutations = require('./mutations')

const resolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query: queries,
  Mutation: mutations,
  MbmOrganization: {
    __resolveType(obj, context, info) {
      if (obj.type === 'Oncology Benefit Manager') {
        return 'ObmOrganization'
      }

      if (obj.type === 'Laboratory Benefit Manager') {
        return 'LbmOrganization'
      }

      return null
    },
  },
}

module.exports = resolvers
