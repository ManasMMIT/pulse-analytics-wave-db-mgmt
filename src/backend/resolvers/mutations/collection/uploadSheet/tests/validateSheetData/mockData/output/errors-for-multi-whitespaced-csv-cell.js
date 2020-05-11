module.exports = [
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit/0",
      "schemaPath": "#/properties/fruit/items/enum",
      "params": {
        "allowedValues": [
          "apple",
          "cherry",
          "pineapple",
          "papaya"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 6,
    "datum": {
      "fruit": [
        ""
      ]
    }
  }
]
