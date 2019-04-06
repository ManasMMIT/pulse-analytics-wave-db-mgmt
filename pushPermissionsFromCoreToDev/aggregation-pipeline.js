module.exports = [
  {
    '$lookup': {
      'from': 'roles',
      'localField': 'role',
      'foreignField': '_id',
      'as': 'role'
    }
  }, {
    '$project': {
      'username': 1,
      'role': {
        '$let': {
          'vars': {
            'roleObj': {
              '$arrayElemAt': [
                '$role', 0
              ]
            }
          },
          'in': '$$roleObj.name'
        }
      },
      'permissions': {
        '$arrayElemAt': [
          '$role.permissions', 0
        ]
      }
    }
  }, {
    '$unwind': {
      'path': '$permissions'
    }
  }, {
    '$lookup': {
      'from': 'pages',
      'localField': 'permissions',
      'foreignField': '_id',
      'as': 'permissions'
    }
  }, {
    '$project': {
      'username': 1,
      'role': 1,
      'permissions': {
        '$arrayElemAt': [
          '$permissions', 0
        ]
      }
    }
  }, {
    '$sort': {
      'permissions.order': 1
    }
  }, {
    '$group': {
      '_id': {
        'usernameId': '$_id',
        'username': '$username',
        'dashboard': '$permissions.dashboard'
      },
      'permissions': {
        '$push': '$$ROOT.permissions'
      }
    }
  }, {
    '$project': {
      'permissions': 1,
      'dashboardId': {
        '$let': {
          'vars': {
            'permissionObj': {
              '$arrayElemAt': [
                '$permissions', 0
              ]
            }
          },
          'in': '$$permissionObj.dashboard'
        }
      }
    }
  }, {
    '$lookup': {
      'from': 'dashboards',
      'localField': 'dashboardId',
      'foreignField': '_id',
      'as': 'dashboard'
    }
  }, {
    '$project': {
      'permissions': {
        '_id': 1,
        'order': 1,
        'type': 1,
        'dashboard': {
          '$let': {
            'vars': {
              'dashboardObj': {
                '$arrayElemAt': [
                  '$dashboard', 0
                ]
              }
            },
            'in': '$$dashboardObj.type'
          }
        }
      },
      'dashboardOrder': {
        '$let': {
          'vars': {
            'dashboardObj': {
              '$arrayElemAt': [
                '$dashboard', 0
              ]
            }
          },
          'in': '$$dashboardObj.order'
        }
      }
    }
  }, {
    '$sort': {
      'dashboardOrder': 1
    }
  }, {
    '$group': {
      '_id': {
        'usernameId': '$_id.usernameId',
        'username': '$_id.username'
      },
      'dashboards': {
        '$push': '$permissions'
      }
    }
  }, {
    '$project': {
      '_id': '$_id.usernameId',
      'username': '$_id.username',
      'dashboards': {
        '$map': {
          'input': '$dashboards',
          'as': 'dashboardArr',
          'in': {
            'dashboard': {
              '$let': {
                'vars': {
                  'obj': {
                    '$arrayElemAt': [
                      '$$dashboardArr', 0
                    ]
                  }
                },
                'in': '$$obj.dashboard'
              }
            },
            'pages': {
              '$map': {
                'input': '$$dashboardArr',
                'as': 'dashboardObj',
                'in': {
                  '_id': '$$dashboardObj._id',
                  'type': '$$dashboardObj.type'
                }
              }
            }
          }
        }
      }
    }
  }
]
