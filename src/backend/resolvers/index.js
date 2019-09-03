const GraphQLJSON = require('graphql-type-json')

const queries = require('./queries')
const mutations = require('./mutations')

const resolvers = {
  JSON: GraphQLJSON,
  Query: queries,
  Mutation: mutations,
}

module.exports = resolvers
