const influencerTemplateObms = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb
    .collection('organizations')
    .aggregate(INFLUENCER_TEMPLATE_AGG)
    .toArray()

module.exports = influencerTemplateObms

const INFLUENCER_TEMPLATE_AGG = [
  {
    $match: {
      type: 'Oncology Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'obm_people',
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
      influencerName: '$influencer.name',
      influencerPosition: 1,
      influencerNpiNumber: '$influencer.nationalProviderIdentifier',
    },
  },
]
