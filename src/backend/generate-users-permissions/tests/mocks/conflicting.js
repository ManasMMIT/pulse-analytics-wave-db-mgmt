const { ObjectId } = require('mongodb')

const input = {
  "a3f419de-ca7d-4498-94dd-04fb9f6b8777": [
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
              "_id": ObjectId("5d711733a317759f67e6e52a")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e4f2")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e54c")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e52e")
            }
          ]
        },
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076de"),
          "regimens": [
            {
              "_id": ObjectId("5d711733a317759f67e6e55c")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e597")
            }
          ]
        }
      ],
      "accounts": [
        {
          "_id": ObjectId("5d825030cc80b15a9476b80f")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b810")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476ba14")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b816")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b817")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b824")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b827")
        },
        {
          "_id": ObjectId("5db6ebe47050fb06e5601491")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b811")
        }
      ]
    },
    {
      "nodeId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "regionalBreakdown": [],
      "treatmentPlans": [
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076de"),
          "regimens": [
            {
              "_id": ObjectId("5d711733a317759f67e6e587")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5e7")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5a2")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5e3")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e4db")
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e55c")
            },
          ]
        },
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076dd"),
          "regimens": []
        }
      ],
      "accounts": [
        {
          "_id": ObjectId("5db6ebe47050fb06e5601491")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b811")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b812")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476ba14")
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b824")
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
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b817"),
          "slug": "aids-healthcare-foundation"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b824"),
          "slug": "apwu-health"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b827"),
          "slug": "atrio-health"
        },
        {
          "_id": ObjectId("5db6ebe47050fb06e5601491"),
          "slug": "av-med"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b811"),
          "slug": "acute-care-health"
        },
        {
          "_id": ObjectId("5d825030cc80b15a9476b812"),
          "slug": "aegon"
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
        },
        {
          "_id": ObjectId("5d6fa1f73b53cf87ec5076de"),
          "name": "AML",
          "regimens": [
            {
              "_id": ObjectId("5d711733a317759f67e6e55c"),
              "name": "Vyxeos"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e597"),
              "name": "Xospata"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e587"),
              "name": "cytarabine+daunomycin"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5e7"),
              "name": "cytarabine+daunomycin+cladribine"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5a2"),
              "name": "Daurismo"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e5e3"),
              "name": "Idhifa"
            },
            {
              "_id": ObjectId("5d711733a317759f67e6e4db"),
              "name": "Mylotarg"
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
