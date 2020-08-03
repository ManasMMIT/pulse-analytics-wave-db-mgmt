const _ = require('lodash')
const getCombinedSitemaps = require('..')

const INPUT_singleSitemap = require('./mocks/input/single-sitemap')
const INPUT_twoDisjointSitemaps = require('./mocks/input/two-disjoint-sitemaps')
const INPUT_twoDisjointSitemapsWithThirdOverlappingOthers = require('./mocks/input/two-disjoint-sitemaps-with-third-overlapping-others')
const INPUT_twoJointSitemaps_CASE1 = require('./mocks/input/two-joint-sitemaps-1')
const INPUT_twoJointSitemaps_CASE2 = require('./mocks/input/two-joint-sitemaps-2')
const INPUT_emptySitemaps = require('./mocks/input/empty-sitemaps')
const INPUT_disjointSitemapsWithMissingNodeTypes = require('./mocks/input/disjoint-sitemaps-with-missing-node-types')
const INPUT_partialSitemap = require('./mocks/input/partial-sitemap')

const OUTPUT_singleSitemap = require('./mocks/output/single-sitemap')
const OUTPUT_twoDisjointSitemaps = require('./mocks/output/two-disjoint-sitemaps')
const OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers = require('./mocks/output/two-disjoint-sitemaps-with-third-overlapping-others')
const OUTPUT_twoJointSitemaps_CASE1 = require('./mocks/output/two-joint-sitemaps-1')
const OUTPUT_twoJointSitemaps_CASE2 = require('./mocks/output/two-joint-sitemaps-2')
const OUTPUT_emptySitemaps = require('./mocks/output/empty-sitemaps')
const OUTPUT_disjointSitemapsWithMissingNodeTypes = require('./mocks/output/disjoint-sitemaps-with-missing-node-types.js.js')
const OUTPUT_partialSitemap = require('./mocks/output/partial-sitemap')

describe(`getCombinedSitemaps util properly combines sitemaps`, () => {
  test('Generates a single sitemap correctly', () => {
    const result = getCombinedSitemaps(INPUT_singleSitemap)
    expect(result).toStrictEqual(OUTPUT_singleSitemap)
  })

  test('Merges two disjoint sitemaps and orders their nodes correctly', () => {
    const resultWithInputOrdered = getCombinedSitemaps(
      INPUT_twoDisjointSitemaps
    )

    expect(resultWithInputOrdered).toStrictEqual(OUTPUT_twoDisjointSitemaps)

    const resultWithInputReversed = getCombinedSitemaps(
      _.cloneDeep(INPUT_twoDisjointSitemaps).reverse()
    )

    expect(resultWithInputReversed).toStrictEqual(OUTPUT_twoDisjointSitemaps)
  })

  test('Merges two disjoint sitemaps with a third sitemap overlapping the other two correctly; orders their nodes correctly', () => {
    const resultWithInputOrdered = getCombinedSitemaps(
      INPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )

    expect(resultWithInputOrdered).toStrictEqual(
      OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )

    const resultWithInputReversed = getCombinedSitemaps(
      _.cloneDeep(INPUT_twoDisjointSitemapsWithThirdOverlappingOthers).reverse()
    )

    expect(resultWithInputReversed).toStrictEqual(
      OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )
  })

  test('Merges two joint sitemaps and orders their nodes correctly, case 1', () => {
    const resultWithInputOrdered = getCombinedSitemaps(
      INPUT_twoJointSitemaps_CASE1
    )

    expect(resultWithInputOrdered).toStrictEqual(OUTPUT_twoJointSitemaps_CASE1)

    const resultWithInputReversed = getCombinedSitemaps(
      _.cloneDeep(INPUT_twoJointSitemaps_CASE1).reverse()
    )

    expect(resultWithInputReversed).toStrictEqual(OUTPUT_twoJointSitemaps_CASE1)
  })

  test('Merges two joint sitemaps and orders their nodes correctly, case 2', () => {
    const resultWithInputOrdered = getCombinedSitemaps(
      INPUT_twoJointSitemaps_CASE2
    )

    expect(resultWithInputOrdered).toStrictEqual(OUTPUT_twoJointSitemaps_CASE2)

    const resultWithInputReversed = getCombinedSitemaps(
      _.cloneDeep(INPUT_twoJointSitemaps_CASE2).reverse()
    )

    expect(resultWithInputReversed).toStrictEqual(OUTPUT_twoJointSitemaps_CASE2)
  })

  test('Merges empty sitemaps correctly', () => {
    const result = getCombinedSitemaps(INPUT_emptySitemaps)

    expect(result).toStrictEqual(OUTPUT_emptySitemaps)
  })

  test('Merges disjoint sitemaps with missing node types correctly', () => {
    const result = getCombinedSitemaps(
      INPUT_disjointSitemapsWithMissingNodeTypes
    )

    expect(result).toStrictEqual(OUTPUT_disjointSitemapsWithMissingNodeTypes)
  })

  test('Merges partial sitemaps correctly', () => {
    const result = getCombinedSitemaps(INPUT_partialSitemap)

    expect(result).toStrictEqual(OUTPUT_partialSitemap)
  })
})
