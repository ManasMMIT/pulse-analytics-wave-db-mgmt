const getUserTeamMapAggPip = (teamUuid) => [
  {
    '$match': {
      'uuid': teamUuid
    }
  }, {
    '$unwind': {
      'path': '$users'
    }
  }, {
    '$replaceRoot': {
      'newRoot': '$users'
    }
  }, {
    '$lookup': {
      'from': 'roles',
      'localField': '_id',
      'foreignField': 'users._id',
      'as': 'teams'
    }
  }, {
    '$project': {
      'keyValuePair': [
        '$_id', '$teams.uuid'
      ]
    }
  }, {
    '$group': {
      '_id': null,
      'keyValArray': {
        '$push': '$keyValuePair'
      }
    }
  }, {
    '$project': {
      'userTeamsMap': {
        '$arrayToObject': '$keyValArray'
      }
    }
  }
]

export default getUserTeamMapAggPip
