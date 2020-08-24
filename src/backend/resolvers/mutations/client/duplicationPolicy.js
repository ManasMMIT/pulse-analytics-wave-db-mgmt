const CLIENT_DUPLICATION_POLICY = {
  source: {
    db: 'pulse-core',
    collection: 'clients',
  },
  destinations: [
    {
      db: 'pulse-core',
      collection: 'users',
      field: 'client',
    },
    {
      db: 'pulse-core',
      collection: 'roles',
      field: 'client',
    },
    {
      db: 'pulse-dev',
      collection: 'users.sitemaps',
      field: 'client',
    },
  ],
}

module.exports = CLIENT_DUPLICATION_POLICY
