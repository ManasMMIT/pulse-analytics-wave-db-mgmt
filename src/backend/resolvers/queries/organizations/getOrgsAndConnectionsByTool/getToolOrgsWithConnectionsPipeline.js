const _ = require('lodash')

module.exports = (toolId, extraProjectionFields) => [
  {
    '$match': {
      'toolIds': toolId
    }
  }, {
    '$lookup': {
      'from': 'organizations.connections',
      'localField': '_id',
      'foreignField': 'orgs',
      'as': 'connections'
    }
  }, {
    '$unwind': {
      'path': '$connections',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$lookup': {
      'from': 'organizations',
      'localField': 'connections.orgs',
      'foreignField': '_id',
      'as': 'connections.orgs'
    }
  }, { // ! TO DEPRECATE: after connections is deleted from organizations collection
    '$project': {
      'connections.orgs.connections': 0
    }
  }, {
    '$project': {
      'slug': 1,
      'type': 1,
      'organization': 1,
      'organizationTiny': 1,
      'toolIds': 1,
      ...extraProjectionFields,
      'connections': {
        '_id': 1,
        'category': 1,
        'state': 1,
        'org': {
          '$arrayElemAt': [
            {
              '$filter': {
                'input': '$connections.orgs',
                'cond': {
                  '$ne': [
                    '$$this._id', '$_id'
                  ]
                }
              }
            }, 0
          ]
        }
      }
    }
  }, {
    '$group': {
      '_id': {
        '_id': '$_id',
        'slug': '$slug',
        'type': '$type',
        'organization': '$organization',
        'organizationTiny': '$organizationTiny',
        'toolIds': '$toolIds',
        ...extraProjectionFields,
      },
      'connections': {
        '$push': '$connections'
      }
    }
  }, {
    '$project': {
      '_id': '$_id._id',
      'slug': '$_id.slug',
      'type': '$_id.type',
      'organization': '$_id.organization',
      'organizationTiny': '$_id.organizationTiny',
      'toolIds': '$_id.toolIds',
      ..._.reduce(
        extraProjectionFields,
        (acc, v, k) => {
          acc[k] = v.replace('$', '$_id.')
          return acc
        },
        {},
      ),
      'connections': {
        '$cond': {
          'if': {
            '$eq': [
              '$connections',
              [{}]
            ]
          },
          'then': [],
          'else': '$connections'
        }
      }
    }
  }
]
