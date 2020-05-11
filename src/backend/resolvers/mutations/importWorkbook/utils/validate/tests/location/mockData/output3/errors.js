module.exports = [
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/location",
      "schemaPath": "#/properties/location/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/location",
            "schemaPath": "#/properties/location/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "validateLocation",
            "dataPath": "/location",
            "schemaPath": "#/properties/location/anyOf/1/allOf/1/validateLocation",
            "params": {
              "keyword": "validateLocation"
            },
            "message": "should pass \"validateLocation\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/location",
            "schemaPath": "#/properties/location/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid location; try another location string or blank out the cell"
    },
    "rowNum": 5,
    "datum": {
      "location": "asdf"
    }
  }
]
