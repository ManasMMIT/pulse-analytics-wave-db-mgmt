import clientMutations from './clientMutations'
import serverMutations from './serverMutations'

const resolvers = {
  Mutation: {
    ...clientMutations,
    ...serverMutations,
  }
}

export default resolvers
