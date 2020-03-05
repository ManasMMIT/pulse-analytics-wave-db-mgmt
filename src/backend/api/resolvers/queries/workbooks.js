const mockData = [
  {
    "_id": 799,
    "workbook": "Pathways-pristine-MASTER",
    "sheets": [
      {
        "sheet": "Program Overview",
        "fields": [
          {
            "field": "slug",
            "type": "string",
            "oneOf": null,
            "_id": 806
          },
          {
            "field": "type",
            "type": "string",
            "oneOf": null,
            "_id": 918
          },
          {
            "field": "organization",
            "type": "string",
            "oneOf": null,
            "_id": 756
          },
          {
            "field": "sponsor",
            "type": "string",
            "oneOf": null,
            "_id": 820
          }
        ],
        "_id": 200
      },
      {
        "sheet": "Capabilities & Performance",
        "fields": [
          {
            "field": "slug",
            "type": "string",
            "oneOf": null,
            "_id": 987
          },
          {
            "field": "type",
            "type": "string",
            "oneOf": null,
            "_id": 262
          },
          {
            "field": "organization",
            "type": "string",
            "oneOf": null,
            "_id": 410
          },
          {
            "field": "itPhysician",
            "type": "boolean",
            "oneOf": null,
            "_id": 698
          }
        ],
        "_id": 796
      }
    ]
  },
  {
    "_id": 847,
    "workbook": "Payer Data Master",
    "sheets": [
      {
        "sheet": "Quality of Access",
        "fields": [
          {
            "field": "indication",
            "type": "string",
            "oneOf": null,
            "_id": 839
          },
          {
            "field": "regimen",
            "type": "string",
            "oneOf": null,
            "_id": 103
          },
          {
            "field": "access",
            "type": "string",
            "oneOf": null,
            "_id": 399
          }
        ],
        "_id": 873
      },
      {
        "sheet": "Additional Criteria",
        "fields": [
          {
            "field": "indication",
            "type": "string",
            "oneOf": null,
            "_id": 652
          },
          {
            "field": "regimen",
            "type": "string",
            "oneOf": null,
            "_id": 671
          },
          {
            "field": "criteria",
            "type": "string",
            "oneOf": null,
            "_id": 423
          },
          {
            "field": "criteriaNotes",
            "type": "boolean",
            "oneOf": null,
            "_id": 681
          }
        ],
        "_id": 900
      }
    ]
  },
  {
    "_id": 568,
    "workbook": "Provider Data Master",
    "sheets": [
      {
        "sheet": "Provider Sheet 1",
        "fields": [
          {
            "field": "indication",
            "type": "string",
            "oneOf": null,
            "_id": 841
          },
          {
            "field": "regimen",
            "type": "string",
            "oneOf": null,
            "_id": 367
          },
          {
            "field": "blah",
            "type": "string",
            "oneOf": null,
            "_id": 166
          }
        ],
        "_id": 495
      },
      {
        "sheet": "Provider Sheet 2",
        "fields": [
          {
            "field": "indication",
            "type": "string",
            "oneOf": null,
            "_id": 386
          },
          {
            "field": "regimen",
            "type": "string",
            "oneOf": null,
            "_id": 678
          },
          {
            "field": "asdfasdf",
            "type": "string",
            "oneOf": null,
            "_id": 244
          }
        ],
        "_id": 553
      }
    ]
  }
]

const workbooks = async (
  parent,
  args,
  context,
) => {
  return mockData
}

module.exports = workbooks
