const {
  indicationId1,
  regimenId1,
  indicationId2,
  regimenId2,
  account1,
  account2,
} = require('./shared-mongo-ids')

const singleTeamInput = [
  {
    "resources": [
      {
        "nodeId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        accounts: [{ _id: account1 }],
        treatmentPlans: [
          {
            _id: indicationId1,
            regimens: [{ _id: regimenId1 }]
          }
        ]
      }
    ]
  },
]

const bothTeamsInput = [
  {
    "resources": [
      {
        "nodeId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        accounts: [{ _id: account1 }],
        treatmentPlans: [
          {
            _id: indicationId1,
            regimens: [{ _id: regimenId1 }]
          }
        ]
      }
    ]
  },
  {
    "resources": [
      {
        "nodeId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        accounts: [{ _id: account2 }],
        treatmentPlans: [
          {
            _id: indicationId2,
            regimens: [
              {
                _id: regimenId2,
              }
            ]
          }
        ]
      }
    ]
  },
]

const singleTeamOutput = [
  {
    "nodeId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
    accounts: [{ _id: account1, slug: 'aetna' }],
    regionalBreakdown: [],
    treatmentPlans: [
      {
        _id: indicationId1,
        name: 'ALL',
        regimens: [
          {
            _id: regimenId1,
            name: 'Besponsa',
          }
        ]
      },
    ]
  }
]

const bothTeamsOutput = [
  {
    "nodeId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
    accounts: [
      {
        _id: account1,
        slug: 'aetna',
      },
      {
        _id: account2,
        slug: 'aegon',
      }
    ],
    regionalBreakdown: [],
    treatmentPlans: [
      {
        _id: indicationId1,
        name: 'ALL',
        regimens: [
          {
            _id: regimenId1,
            name: 'Besponsa',
          }
        ]
      },
      {
        _id: indicationId2,
        name: 'Nasal Polyps',
        regimens: [
          {
            _id: regimenId2,
            name: 'Dupixent',
          }
        ]
      },
    ]
  }
]

module.exports = {
  singleTeamInput,
  bothTeamsInput,
  singleTeamOutput,
  bothTeamsOutput,
}