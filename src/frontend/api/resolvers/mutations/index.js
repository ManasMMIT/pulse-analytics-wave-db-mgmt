import clientResolvers from './client'
import teamResolvers from './team'
import userResolvers from './user'
import sitemapResolvers from './sitemap'

const mutations = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...sitemapResolvers,
}

export default mutations
