const GraphQLJSON = require('graphql-type-json')
const {
  GraphQLDate,
  // GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date')

const queries = require('./queries')
const mutations = require('./mutations')

const resolvers = {
  JSON: GraphQLJSON,
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query: queries,
  Mutation: mutations,
}

module.exports = resolvers
