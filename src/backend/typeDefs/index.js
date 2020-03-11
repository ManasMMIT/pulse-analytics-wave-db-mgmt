const { gql } = require('apollo-server-express')

const queries = require('./queries')
const mutations = require('./mutations')

module.exports = [
  gql`scalar JSON`,
  gql`scalar Date`,
  gql`scalar DateTime`,
  ...queries,
  ...mutations,
]
