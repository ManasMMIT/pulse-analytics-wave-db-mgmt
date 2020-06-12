const { ObjectId } = require('mongodb')

module.exports = {
  "_id": ObjectId("5e736d74b6f1bf57a480ea1e"),
  "name": "Mock Sheet",
  "collection": "Mock Collection",
  "fields": [
    {
      "_id": ObjectId("5e736d9eb6f1bf57a480ea20"),
      "name": "fruit",
      "type": "string",
      "businessObjRef": {
        "_id": ObjectId("5e62da4b9514b7f2c0bc91c6"),
        "fieldId": ObjectId("5e62da4b9514b7f2c0bc91c7"),
        allowBlankValues: true,
      },
      "oneOf": 'These oneOf strings should be ignored completely'.split(' '),
    },
    {
      "_id": ObjectId("5e736d9eb6f1bf57a480ea21"),
      "name": "vegetable",
      "type": "string",
      "businessObjRef": {
        "_id": ObjectId("5e62da4b9514b7f2c0bc91c6"),
        "fieldId": ObjectId("5e62f11d374fa0f578c44585"),
        allowBlankValues: true,
      },
    },
  ],
}
