const testingPostfix = 'UpdateIntegrationTest'

const clientA = {
  _id: 'clientA' + testingPostfix,
  name: 'clientA',
  description: 'clientA',
}

const userA = {
  _id: 'userA' + testingPostfix,
  username: 'userA@example.com',
  email: 'userA@example.com',
  client: clientA,
}

const userB = {
  _id: 'userB' + testingPostfix,
  username: 'userB@example.com',
  email: 'userB@example.com',
  client: clientA,
}

const roleA = {
  _id: 'roleA' + testingPostfix,
  name: 'roleA',
  description: 'roleA',
  client: clientA,
  users: [userA],
}

const roleB = {
  _id: 'roleB' + testingPostfix,
  name: 'roleB',
  description: 'roleB',
  client: clientA,
  users: [userB],
}

const userSitemapA = {
  _id: userA._id,
  client: clientA,
}

const userSitemapB = {
  _id: userB._id,
  client: clientA,
}

const MOCK_DB_DATA = {
  'pulse-core': {
    users: [userA, userB],
    roles: [roleA, roleB],
  },
  'pulse-dev': {
    'users.sitemaps': [userSitemapA, userSitemapB],
  },
}

module.exports = {
  clientA,
  MOCK_DB_DATA,
}
