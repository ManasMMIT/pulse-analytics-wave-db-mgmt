const d3 = require('d3-collection')

class BusinessObject {
  static async getFieldMap({ boId, db }) {
    const keyLabelBoIdDocs = await db
      .collection('businessObjects.modals')
      .aggregate(
        [
          {
            $match: { boId },
          },
          {
            $unwind: {
              path: '$tags',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$tags',
            },
          },
          {
            $unwind: {
              path: '$sections',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$sections',
            },
          },
          {
            $unwind: {
              path: '$fields',
            },
          },
          {
            $replaceRoot: {
              newRoot: '$fields',
            },
          },
          {
            $lookup: {
              from: 'businessObjects',
              localField: 'boFieldId',
              foreignField: 'fields._id',
              as: 'bo',
            },
          },
          {
            $addFields: {
              boField: {
                $arrayElemAt: ['$bo', 0],
              },
            },
          },
          {
            $addFields: {
              boField: {
                $filter: {
                  input: '$boField.fields',
                  as: 'field',
                  cond: {
                    $eq: [
                      {
                        $toString: '$$field._id',
                      },
                      {
                        $toString: '$boFieldId',
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $addFields: {
              bo: {
                $arrayElemAt: ['$bo', 0],
              },
              boField: {
                $arrayElemAt: ['$boField', 0],
              },
            },
          },
          {
            $project: {
              label: 1,
              key: '$boField.key',
            },
          },
        ],
        { allowDiskUse: true }
      )
      .toArray()

    return d3
      .nest()
      .key((row) => row.key)
      .rollup((arr) => ({ fieldId: arr[0]._id, fieldLabel: arr[0].label }))
      .object(keyLabelBoIdDocs)
  }

  static async getRelationalFieldMap({ boId, db }) {
    const widgetLabelDocs = await db
      .collection('businessObjects.modals.widgets')
      .aggregate(
        [
          {
            $match: { connectedEntities: boId },
          },
          {
            $unwind: {
              path: '$fields',
            },
          },
          {
            $project: {
              connectedEntities: 1,
              key: '$fields.key',
              label: '$fields.label',
              boId: '$fields.boId',
            },
          },
        ],
        { allowDiskUse: true }
      )
      .toArray()

    return d3
      .nest()
      .key((row) => row.connectedEntities[0])
      .key((row) => row.connectedEntities[1])
      .key((row) => row.key)
      .rollup((arr) => ({
        fieldId: arr[0]._id,
        fieldLabel: arr[0].label,
        boId: arr[0].boId,
      }))
      .object(widgetLabelDocs)
  }
}

module.exports = BusinessObject
