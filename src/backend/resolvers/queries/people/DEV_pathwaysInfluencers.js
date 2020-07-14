module.exports = (parent, args, { pulseDevDb }) =>
  pulseDevDb
    .collection('pathwaysInfluencers')
    .find({ personId: { $ne: null } })
    .toArray()
