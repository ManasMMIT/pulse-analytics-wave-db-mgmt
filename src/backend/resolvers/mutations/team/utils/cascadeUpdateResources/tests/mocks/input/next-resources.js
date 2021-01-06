const ObjectId = require('mongodb').ObjectId

module.exports = {
  nodeId: 'a3f419de-ca7d-4498-94dd-04fb9f6b8777',
  treatmentPlans: [
    {
      // marked for addition
      _id: ObjectId('5d6fa1f73b53cf87ec5076dd'),
      regimens: [],
    },
    {
      _id: ObjectId('5d6fa1f73b53cf87ec5076de'),
      regimens: [],
    },
    {
      _id: ObjectId('5d6fa1f73b53cf87ec5076e0'),
      regimens: [
        {
          _id: ObjectId('5d711733a317759f67e6e578'),
        },
        {
          // marked for addition
          _id: ObjectId('5d711733a317759f67e6e596'),
        },
      ],
    },
  ],
  accounts: [
    {
      _id: ObjectId('5d825030cc80b15a9476b80f'), // marked for addition
    },
    {
      _id: ObjectId('5d825030cc80b15a9476b810'),
    },
  ],
}
