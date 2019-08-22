/* eslint-disable no-loop-func */
const _ = require('lodash')

module.exports = sitemaps => {
  const combinedSitemaps = {}
  for (const sitemap of sitemaps) {
    Object.keys(sitemap).forEach(nodeType => {
      const nodes = sitemap[nodeType]

      if (!combinedSitemaps[nodeType]) {
        combinedSitemaps[nodeType] = nodes
      } else {
        combinedSitemaps[nodeType] = combinedSitemaps[nodeType].concat(nodes)

        combinedSitemaps[nodeType] = _.uniq(
          combinedSitemaps[nodeType],
          '_id'
        )
      }
      combinedSitemaps[nodeType] = _.orderBy(
        combinedSitemaps[nodeType],
        ['parentId', 'order']
      )
    })
  }

  return combinedSitemaps;
}
