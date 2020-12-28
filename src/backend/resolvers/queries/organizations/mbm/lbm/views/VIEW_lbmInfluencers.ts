const VIEW_lbmInfluencers = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').aggregate(VIEW_AGG).toArray()

export default VIEW_lbmInfluencers

const VIEW_AGG = [
  {
    $match: {
      type: 'Laboratory Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'JOIN_lbms_people',
      localField: '_id',
      foreignField: 'lbmId',
      as: 'lbmInfluencers',
    },
  },
  {
    $unwind: {
      path: '$lbmInfluencers',
    },
  },
  {
    $project: {
      _id: '$lbmInfluencers._id',
      lbmId: '$_id',
      lbmOrganization: '$organization',
      influencerId: '$lbmInfluencers.personId',
      influencerPosition: '$lbmInfluencers.position',
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
      lbmId: 1,
      lbmOrganization: 1,
      influencerId: '$influencer._id',
      influencerFirstName: '$influencer.firstName',
      influencerLastName: '$influencer.lastName',
      influencerPosition: 1,
      influencerNpiNumber: '$influencer.nationalProviderIdentifier',
    },
  },
]
