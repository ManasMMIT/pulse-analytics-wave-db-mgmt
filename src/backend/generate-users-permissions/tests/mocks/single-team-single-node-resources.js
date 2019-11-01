const { ObjectId } = require('mongodb')

const input = {
  'a3f419de-ca7d-4498-94dd-04fb9f6b8777': [
    {
      "nodeId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "regionalBreakdown": [],
      "treatmentPlans": [
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076dc"),
          "regimens": []
        },
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076dd"),
          "regimens": [
            {
              "_id": ObjectId("5d711733a317759f67e6e52a"),
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e4f2"),
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e54c"),
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e52e"),
            }
          ]
        }
      ],
      "accounts": [
        {
          "_id": ObjectId("5d825030cc80b15a9476b80f"),
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b810"),
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476ba14"),
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b816"),
        }
      ]
    }
  ]
}

const output = {
  "_id": "auth0|5db864fb3f0d010e29343e62",
  "resources": [
    {
      "nodeId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "accounts": [
        {
          "_id": ObjectId("5d825030cc80b15a9476b80f"),
          "slug": "4d-pharmacy-management"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b810"),
          "slug": "a&d-charitable-foundation"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476ba14"),
          "slug": "advantage-health-solutions"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b816"),
          "slug": "ahmc-central-health"
        }
      ],
      "regionalBreakdown": [],
      "treatmentPlans": [
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076dc"),
          "name": "AD",
          "regimens": []
        },
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076dd"),
          "name": "ALL",
          "regimens": [
            {
              "_id": ObjectId("5d711733a317759f67e6e52a"),
              "name": "Asparlas"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e4f2"),
              "name": "Besponsa"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e54c"),
              "name": "Blincyto"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e52e"),
              "name": "Kymriah"
            }
          ]
        }
      ]
    }
  ]
}

module.exports = {
  input,
  output,
}