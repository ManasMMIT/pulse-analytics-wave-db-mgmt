const { CLIENT_A } = require('../../../../shared/mocks/clients')

module.exports = {
  USER_A: {
    _id: 1,
    client: CLIENT_A,
    username: 'User A',
    email: 'user_a@example.com',
    defaultLanding: {
      path: '/payer/management',
      locked: false,
    },
  },
  USER_B: {
    _id: 2,
    client: CLIENT_A,
    username: 'User B',
    email: 'user_b@example.com',
  },
  USER_C: {
    _id: 3,
    client: CLIENT_A,
    username: 'User C',
    email: 'user_c@example.com',
  },
  USER_D: {
    _id: 4,
    client: CLIENT_A,
    username: 'User D',
    email: 'user_d@example.com',
  },
  USER_E: {
    _id: 5,
    client: CLIENT_A,
    username: 'User E',
    email: 'user_e@example.com',
  },
}
