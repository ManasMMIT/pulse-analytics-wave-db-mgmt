module.exports = (matchStage) => [
  matchStage,
  {
    $lookup: {
      from: 'organizations',
      localField: 'pathwaysId',
      foreignField: '_id',
      as: 'pathways',
    },
  },
  {
    $lookup: {
      from: 'people',
      localField: 'personId',
      foreignField: '_id',
      as: 'person',
    },
  },
  {
    $lookup: {
      from: 'indications',
      localField: 'indicationIds',
      foreignField: '_id',
      as: 'indication',
    },
  },
  {
    $addFields: {
      person: {
        $arrayElemAt: ['$person', 0],
      },
      pathways: {
        $arrayElemAt: ['$pathways', 0],
      },
      startDate: {
        $dateToParts: {
          date: '$startDate',
          timezone: 'America/New_York',
        },
      },
    },
  },
  {
    $project: {
      slug: '$pathways.slug',
      createdOn: {
        $ifNull: [
          '$updatedOn',
          {
            $toDate: '$_id',
          },
        ],
      },
      organizationType: '$pathways.type',
      organization: '$pathways.organization',
      member: {
        $concat: [
          '$person.firstName',
          {
            $cond: [
              {
                $eq: ['$person.middleName', null],
              },
              '',
              {
                $concat: [' ', '$person.middleName'],
              },
            ],
          },
          {
            $cond: [
              {
                $eq: ['$person.lastName', null],
              },
              '',
              {
                $concat: [' ', '$person.lastName'],
              },
            ],
          },
        ],
      },
      influencerType: {
        $reduce: {
          input: '$pathwaysInfluencerTypes',
          initialValue: '',
          in: {
            $concat: [
              '$$value',
              {
                $cond: [
                  {
                    $eq: ['$$value', ''],
                  },
                  '',
                  ', ',
                ],
              },
              '$$this',
            ],
          },
        },
      },
      title: '$position',
      affiliation: '$person.affiliation',
      affiliationPosition: '$person.affiliationPosition',
      primaryState: '$person.primaryState',
      type: 'Pathways',
      indication: '$indication.name',
      indicationCategory: '$tumorTypeSpecialty',
      startDate: {
        $concat: [
          {
            $toString: '$startDate.month',
          },
          '/',
          {
            $toString: '$startDate.day',
          },
          '/',
          {
            $toString: '$startDate.year',
          },
        ],
      },
      priority: 1,
      alertDate: '$alert.date',
      alertType: '$alert.type',
      alertDescription: '$alert.description',
      npiNumber: {
        $toString: '$person.nationalProviderIdentifier',
      },
      outdated: '$endDate',
      materializedOn: '$$NOW',
      pathwaysId: 1,
      personId: 1,
    },
  },
]
