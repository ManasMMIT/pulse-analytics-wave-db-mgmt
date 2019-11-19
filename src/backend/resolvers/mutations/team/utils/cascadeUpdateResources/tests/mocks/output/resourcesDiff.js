const ObjectId = require('mongodb').ObjectId

module.exports = {
  accountsToRemove: {
    "5d825030cc80b15a9476ba14": {
      "_id": ObjectId("5d825030cc80b15a9476ba14")
    }
  },
  accountsToAdd: {
    "5d825030cc80b15a9476b80f": {
      "_id": ObjectId("5d825030cc80b15a9476b80f")
    },
  },
  treatmentPlansToAdd: {
    "5d6fa1f73b53cf87ec5076dd": {},
    "5d6fa1f73b53cf87ec5076e0": {
      "5d711733a317759f67e6e596": {
        "_id": ObjectId("5d711733a317759f67e6e596")
      }
    }
  },
  treatmentPlansToRemove: [
    {
      "_id": ObjectId("5d6fa1f73b53cf87ec5076dc"),
      "regimens": null
    },
    {
      "_id": ObjectId("5d6fa1f73b53cf87ec5076e0"),
      "regimens": {
        "_id": ObjectId("5d711733a317759f67e6e503")
      }
    },
    {
      "_id": ObjectId("5d6fa1f73b53cf87ec507724"),
      "regimens": null
    },
    {
      "_id": ObjectId("5d6fa1f73b53cf87ec507724"),
      "regimens": {
        "_id": ObjectId("5d711733a317759f67e6e512")
      }
    },
    {
      "_id": ObjectId("5d6fa1f73b53cf87ec507724"),
      "regimens": {
        "_id": ObjectId("5d711733a317759f67e6e51e")
      }
    }
  ],
}
