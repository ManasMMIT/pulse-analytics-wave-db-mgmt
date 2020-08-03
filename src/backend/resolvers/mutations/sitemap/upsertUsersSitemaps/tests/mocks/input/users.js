const { CLIENT_A } = require('../../../../../shared/mocks/clients')

module.exports = {
  USER_F: {
    _id: 6,
    client: CLIENT_A,
    username: 'User F',
    email: 'user_f@example.com',
    defaultLanding: {
      path: '/payer/management',
      locked: false,
    },
  },
  USER_G: {
    _id: 7,
    client: CLIENT_A,
    username: 'User G',
    email: 'user_g@example.com',
  },
  USER_H: {
    _id: 8,
    client: CLIENT_A,
    username: 'User H',
    email: 'user_h@example.com',
  },
}
