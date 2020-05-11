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
      "oneOf": ['test', 'banana'],
    },
    {
      "_id": ObjectId("5e736d9eb6f1bf57a480ea21"),
      "name": "vegetable",
      "type": "number",
    },
  ],
}
