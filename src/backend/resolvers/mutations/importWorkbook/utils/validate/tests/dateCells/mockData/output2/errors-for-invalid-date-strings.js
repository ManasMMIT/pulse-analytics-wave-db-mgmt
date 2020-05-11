module.exports = [
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 4,
    "datum": {
      "timestamp": "asdf"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 5,
    "datum": {
      "timestamp": "NaN"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/0/type",
            "params": {
              "type": "string"
            },
            "message": "should be string"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 6,
    "datum": {
      "timestamp": {}
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/0/type",
            "params": {
              "type": "string"
            },
            "message": "should be string"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 7,
    "datum": {
      "timestamp": []
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/0/type",
            "params": {
              "type": "string"
            },
            "message": "should be string"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 8,
    "datum": {
      "timestamp": new Date("2019-03-01T05:00:00.000Z")
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 9,
    "datum": {
      "timestamp": "12/33/2020"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 10,
    "datum": {
      "timestamp": "2020-19-01"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 11,
    "datum": {
      "timestamp": "Sunday, March 29, 2020"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 12,
    "datum": {
      "timestamp": "Sunday March 29 2020"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 13,
    "datum": {
      "timestamp": "1/21/2020  2:07:00 PM"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 14,
    "datum": {
      "timestamp": "1/21/20 0:00"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 15,
    "datum": {
      "timestamp": "14-Mar-12"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 16,
    "datum": {
      "timestamp": "13-Mar-2012"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 17,
    "datum": {
      "timestamp": "2020-01-21T04:00:00.000X"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 18,
    "datum": {
      "timestamp": "2020-01-32"
    }
  },
  {
    "error": {
      "keyword": "errorMessage",
      "dataPath": "/timestamp",
      "schemaPath": "#/properties/timestamp/errorMessage",
      "params": {
        "errors": [
          {
            "keyword": "type",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/0/type",
            "params": {
              "type": "null"
            },
            "message": "should be null"
          },
          {
            "keyword": "coerceToDate",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf/1/allOf/1/coerceToDate",
            "params": {
              "keyword": "coerceToDate"
            },
            "message": "should pass \"coerceToDate\" keyword validation"
          },
          {
            "keyword": "anyOf",
            "dataPath": "/timestamp",
            "schemaPath": "#/properties/timestamp/anyOf",
            "params": {},
            "message": "should match some schema in anyOf"
          }
        ]
      },
      "message": "Invalid date; make cell Date type OR format as yyyy-MM-dd, d/M/yy, or dd/MM/yyyy"
    },
    "rowNum": 19,
    "datum": {
      "timestamp": "2020-01-21T42:00:00.000Z"
    }
  }
]
