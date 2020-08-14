const { indicationId1, regimenId1, account1 } = require('../shared-mongo-ids')

module.exports = [
  {
    resources: [
      {
        nodeId: '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52',
        accounts: [{ _id: account1 }],
        treatmentPlans: [
          {
            _id: indicationId1,
            regimens: [{ _id: regimenId1 }],
          },
        ],
      },
    ],
  },
]
