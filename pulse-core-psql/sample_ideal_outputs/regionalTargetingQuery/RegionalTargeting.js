import regionalTargetingQuery from './ideal_regional_targeting.graphql'

// better

const RegionalTargeting = () => {}

const queryConfig = {
  options: ({ resources }) => {
    const { regionalBreakdown } = resources
    return { variables: { regionalBreakdown } }
  },
}

export default graphql(regionalTargetingQuery, queryConfig)(RegionalTargeting)

// best

const RegionalTargeting = () => {}

export default graphql(regionalTargetingQuery)(RegionalTargeting)
