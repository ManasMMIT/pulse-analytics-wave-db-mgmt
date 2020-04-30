const { ObjectId } = require('mongodb')

module.exports = {
  collection: str => {
    if (str === 'businessObjects') {
      return {
        findOne: () => {
          return {
            "_id": ObjectId("5e62da4b9514b7f2c0bc91c6"),
            "name": "Produce",
            "sourceCollection": {
              "collection": "produce",
              "query": {}
            },
            "fields": [
              {
                "_id": ObjectId("5e62da4b9514b7f2c0bc91c7"),
                "key": "fruit",
                "type": "string"
              },
              {
                "_id": ObjectId("5e62f11d374fa0f578c44585"),
                "key": "vegetable",
                "type": "string"
              },
            ]
          }
        }
      }
    } else if (str === 'produce') {
      return {
        find: () => {
          return {
            toArray: () => produceRawData
          }
        }
      }
    }
  }
}

const produceRawData = [
  {
    "_id": ObjectId("5d825338cc80b15a9476ba88"),
    "fruit": "supersetFruit1",
    "vegetable": "supersetVeggie1",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba88"),
    "fruit": "supersetFruit2",
    "vegetable": "supersetVeggie2",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba88"),
    "fruit": "supersetFruit3",
    "vegetable": "tomato",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba84"),
    "fruit": "apple",
    "vegetable": "lettuce",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba85"),
    "fruit": "cherry",
    "vegetable": "broccoli",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba86"),
    "fruit": "pineapple",
    "vegetable": "onion",
  },
  {
    "_id": ObjectId("5d825338cc80b15a9476ba87"),
    "fruit": "papaya",
    "vegetable": "mushrooms",
  },
]
