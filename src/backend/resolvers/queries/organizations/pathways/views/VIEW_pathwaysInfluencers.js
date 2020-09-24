const VIEW_AGG = [
  {
    $match: {
      type: 'Pathways',
    },
  },
  {
    $lookup: {
      from: 'JOIN_pathways_people',
      localField: '_id',
      foreignField: 'pathwaysId',
      as: 'pathwaysInfluencers',
    },
  },
  {
    $unwind: {
      path: '$pathwaysInfluencers',
    },
  },
  {
    $project: {
      _id: '$pathwaysInfluencers._id',
      pathwaysId: '$_id',
      pathwaysOrganization: '$organization',
      influencerId: '$pathwaysInfluencers.personId',
      influencerType: '$pathwaysInfluencers.influencerType',
      influencerPosition: '$pathwaysInfluencers.title',
    },
  },
  {
    $lookup: {
      from: 'people',
      localField: 'influencerId',
      foreignField: '_id',
      as: 'influencer',
    },
  },
  {
    $addFields: {
      influencer: {
        $arrayElemAt: ['$influencer', 0],
      },
    },
  },
  {
    $project: {
      pathwaysId: 1,
      pathwaysOrganization: 1,
      influencerId: '$influencer._id',
      influencerType: 1,
      influencerPosition: 1,
      influencerFirstName: '$influencer.firstName',
      influencerLastName: '$influencer.lastName',
      influencerMiddleName: '$influencer.middleName',
      influencerNpiNumber: '$influencer.nationalProviderIdentifier',
      updatedOn: '$influencer.updatedOn',
    },
  },
]

const VIEW_pathwaysInfluencers = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').aggregate(VIEW_AGG).toArray()

module.exports = VIEW_pathwaysInfluencers
