module.exports = [
  {
    "error": "Row 4 is duplicated on row(s) 6, 10",
    "rowNum": 4,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "test",
          "banana"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 4,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 4,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "test",
          "banana"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 5,
    "datum": {
      "fruit": "hello",
      "vegetable": "world"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 5,
    "datum": {
      "fruit": "hello",
      "vegetable": "world"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "test",
          "banana"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 6,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 6,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 7,
    "datum": {
      "fruit": "test",
      "vegetable": "asdf"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 8,
    "datum": {
      "fruit": "banana",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "test",
          "banana"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 9,
    "datum": {
      "fruit": "papaya",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 9,
    "datum": {
      "fruit": "papaya",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/fruit",
      "schemaPath": "#/properties/fruit/enum",
      "params": {
        "allowedValues": [
          "test",
          "banana"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 10,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/vegetable",
      "schemaPath": "#/properties/vegetable/type",
      "params": {
        "type": "null,number"
      },
      "message": "should be null,number"
    },
    "rowNum": 10,
    "datum": {
      "fruit": "apple",
      "vegetable": "broccoli"
    }
  }
]
