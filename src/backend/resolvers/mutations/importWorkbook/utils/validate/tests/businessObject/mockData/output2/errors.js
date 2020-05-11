module.exports = [
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "supersetFruit1",
          "supersetFruit2",
          "supersetFruit3",
          "apple",
          "cherry",
          "pineapple",
          "papaya"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 4,
    "datum": {
      "fruit": "typo",
      "vegetable": "scallion"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/enum",
      "params": {
        "allowedValues": [
          "supersetVeggie1",
          "supersetVeggie2",
          "tomato",
          "lettuce",
          "broccoli",
          "onion",
          "mushrooms"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 4,
    "datum": {
      "fruit": "typo",
      "vegetable": "scallion"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "supersetFruit1",
          "supersetFruit2",
          "supersetFruit3",
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
      "fruit": "banana",
      "vegetable": "tomato"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/enum",
      "params": {
        "allowedValues": [
          "supersetVeggie1",
          "supersetVeggie2",
          "tomato",
          "lettuce",
          "broccoli",
          "onion",
          "mushrooms"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 8,
    "datum": {
      "fruit": "apple",
      "vegetable": "potato"
    }
  }
]
