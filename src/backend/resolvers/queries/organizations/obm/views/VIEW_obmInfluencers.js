const VIEW_obmInfluencers = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').aggregate(VIEW_AGG).toArray()

module.exports = VIEW_obmInfluencers

const VIEW_AGG = [
  {
    $match: {
      type: 'Oncology Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'JOIN_obms_people',
      localField: '_id',
      foreignField: 'obmId',
      as: 'obmInfluencers',
    },
  },
  {
    $unwind: {
      path: '$obmInfluencers',
    },
  },
  {
    $project: {
      _id: '$obmInfluencers._id',
      obmId: '$_id',
      obmOrganization: '$organization',
      influencerId: '$obmInfluencers.personId',
      influencerPosition: '$obmInfluencers.position',
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
      obmId: 1,
      obmOrganization: 1,
      influencerId: '$influencer._id',
      influencerFirstName: '$influencer.firstName',
      influencerLastName: '$influencer.lastName',
      influencerPosition: 1,
      influencerNpiNumber: '$influencer.nationalProviderIdentifier',
    },
  },
]
