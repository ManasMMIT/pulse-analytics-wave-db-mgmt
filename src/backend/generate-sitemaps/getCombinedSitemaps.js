/* eslint-disable no-loop-func */
const _ = require('lodash')
const getCombinedResources = require('./getCombinedResources')

module.exports = sitemaps => {
  const combinedSitemaps = {}
  for (const sitemap of sitemaps) {
    Object.keys(sitemap).forEach(nodeType => {
      const nodes = sitemap[nodeType]

      if (!combinedSitemaps[nodeType]) {
        combinedSitemaps[nodeType] = nodes
      } else {
        combinedSitemaps[nodeType] = combinedSitemaps[nodeType].concat(nodes)

        combinedSitemaps[nodeType].forEach(node => {
          if (node.resources) {
            const duplicateNodes = combinedSitemaps[nodeType]
              .filter(targetNode => targetNode._id === node._id)
            
            const duplicateNodesResources = duplicateNodes
              .map(({ resources }) => resources)

            const combinedResources = getCombinedResources(duplicateNodesResources)

            duplicateNodes.forEach(dupe => {
              dupe.resources = combinedResources
            })
          }
        })

        combinedSitemaps[nodeType] = _.uniqBy(
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
