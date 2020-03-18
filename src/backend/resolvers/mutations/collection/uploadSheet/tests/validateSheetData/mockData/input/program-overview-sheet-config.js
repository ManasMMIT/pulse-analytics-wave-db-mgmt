const { ObjectId } = require('mongodb')

module.exports = {
  "_id": ObjectId("5e62da4b9514b7f2c0bc91c6"),
  "name": "Program Overview",
  "collection": "programOverview",
  "fields": [
    {
      "name": "slug",
      "type": "string",
      "oneOf": null,
      "_id": ObjectId("5e62da4b9514b7f2c0bc91c7"),
    },
    {
      "name": "type",
      "type": "string",
      "oneOf": null,
      "_id": ObjectId("5e62da4b9514b7f2c0bc91c8"),
    },
    {
      "name": "organization",
      "type": "string",
      "oneOf": null,
      "_id": ObjectId("5e62da4b9514b7f2c0bc91c9"),
    },
    {
      "_id": ObjectId("5e62f093374fa0f578c44581"),
      "name": "overview",
      "type": "string",
      "oneOf": []
    },
    {
      "_id": ObjectId("5e62f0e4374fa0f578c44582"),
      "name": "sponsor",
      "type": "string",
      "oneOf": [
        "Payer",
        "Internal",
        "Vendor",
        "CMS",
        "ASCO",
        "Provider"
      ]
    },
    {
      "_id": ObjectId("5e62f10b374fa0f578c44583"),
      "name": "start",
      "type": "string",
      "oneOf": []
    },
    {
      "_id": ObjectId("5e62f115374fa0f578c44584"),
      "name": "end",
      "type": "string",
      "oneOf": []
    },
    {
      "_id": ObjectId("5e62f11d374fa0f578c44585"),
      "name": "focus",
      "type": "string",
      "oneOf": []
    },
    {
      "_id": ObjectId("5e62f14a374fa0f578c44586"),
      "name": "commercial",
      "type": "integer",
      "oneOf": [
        "1",
        "0"
      ]
    },
    {
      "_id": ObjectId("5e62f156374fa0f578c44587"),
      "name": "medicaid",
      "type": "integer",
      "oneOf": [
        "1",
        "0"
      ]
    },
    {
      "_id": ObjectId("5e62f15f374fa0f578c44588"),
      "name": "medicare",
      "type": "integer",
      "oneOf": [
        "1",
        "0"
      ]
    },
    {
      "_id": ObjectId("5e62f169374fa0f578c44589"),
      "name": "exchange",
      "type": "integer",
      "oneOf": [
        "1",
        "0"
      ]
    }
  ],
}
