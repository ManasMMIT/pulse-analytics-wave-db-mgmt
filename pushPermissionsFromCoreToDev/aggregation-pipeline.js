module.exports = [
  {
    '$unwind': {
      'path': '$items'
    }
  }, {
    '$unwind': {
      'path': '$items.users'
    }
  }, {
    '$sort': {
      'items.order': 1
    }
  }, {
    '$project': {
      'dashboard': '$type',
      'page': {
        'type': '$items.type',
        '_id': '$items._id'
      },
      'user': '$items.users'
    }
  }, {
    '$group': {
      '_id': {
        'user': '$user',
        'dashboard': '$dashboard'
      },
      'pages': {
        '$push': '$page'
      }
    }
  }, {
    '$group': {
      '_id': '$_id.user',
      'dashboards': {
        '$push': {
          'tool': '$_id.dashboard',
          'pages': '$pages'
        }
      }
    }
  }, {
    '$lookup': {
      'from': 'users',
      'localField': '_id',
      'foreignField': '_id',
      'as': 'userObj'
    }
  }, {
    '$project': {
      '_id': 0,
      'username': {
        '$arrayElemAt': [
          '$userObj.username', 0
        ]
      },
      'dashboards': 1
    }
  }
]
