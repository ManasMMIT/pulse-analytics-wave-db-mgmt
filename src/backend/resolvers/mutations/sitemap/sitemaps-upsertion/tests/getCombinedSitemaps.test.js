const _ = require('lodash')
const getCombinedSitemaps = require('../getCombinedSitemaps')

const providerOnlySitemap = require('./mocks/sitemap-provider-only').mock
const payersOnlySitemap = require('./mocks/sitemap-payers-only').mock
const mockCombinedSitemap = require('./mocks/combined-sitemap').mock

const {
  tools,
  dashboards,
  pages,
  cards
} = getCombinedSitemaps([providerOnlySitemap, payersOnlySitemap])

test('combines tools correctly', () => {
  expect(_.sortBy(tools, '_id')).toEqual(_.sortBy(mockCombinedSitemap.tools, '_id'))
})
test('combines dashboards correctly', () => {
  expect(_.sortBy(dashboards, '_id')).toEqual(_.sortBy(mockCombinedSitemap.dashboards, '_id'))
})

test('combines pages correctly', () => {
  expect(_.sortBy(pages, '_id')).toEqual(_.sortBy(mockCombinedSitemap.pages, '_id'))
})

test('combines cards correctly', () => {
  expect(_.sortBy(cards, '_id')).toEqual(_.sortBy(mockCombinedSitemap.cards, '_id'))
})
