import clientQueryResolvers from './client'
import teamQueryResolvers from './team'

const queries = {
  ...clientQueryResolvers,
  ...teamQueryResolvers,
}

export default queries
