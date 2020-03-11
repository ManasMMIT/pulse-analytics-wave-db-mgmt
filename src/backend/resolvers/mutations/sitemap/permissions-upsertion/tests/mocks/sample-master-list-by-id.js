const {
  indicationId1,
  regimenId1,
  indicationId2,
  regimenId2,
  product1,
  account1,
  account2,
} = require('./shared-mongo-ids')

module.exports = {
  [indicationId1]: {
    _id: indicationId1,
    name: 'ALL',
    regimens: [
      {
        _id: regimenId1,
        name: 'Besponsa',
        products: []
      }
    ]
  },
  [regimenId1]: {
    _id: regimenId1,
    name: 'Besponsa',
    products: []
  },
  [indicationId2]: {
    _id: indicationId2,
    name: 'Nasal Polyps',
    regimens: [
      {
        _id: regimenId2,
        name: 'Dupixent',
        products: [
          {
            _id: product1,
            nameBrand: 'Dupixent',
            nameGeneric: 'Dupilumab',
          }
        ]
      }
    ]
  },
  [regimenId2]: {
    _id: regimenId2,
    name: 'Dupixent',
    products: [
      {
        _id: product1,
        nameBrand: 'Dupixent',
        nameGeneric: 'Dupilumab',
      }
    ]
  },
  [account1]: {
    _id: account1,
    organization: 'Aetna',
    organizationTiny: 'Aetna',
    slug: 'aetna',
    type: 'Payer',
  },
  [account2]: {
    _id: account2,
    organization: 'Aegon',
    organizationTiny: 'Aegon',
    slug: 'aegon',
    type: 'Payer',
  },
}