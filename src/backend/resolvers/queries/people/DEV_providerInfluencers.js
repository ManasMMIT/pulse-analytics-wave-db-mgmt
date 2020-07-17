module.exports = (parent, args, { pulseDevDb }) =>
  pulseDevDb
    .collection('providerKeyDecisionMakers')
    .find({ personId: { $ne: null } })
    .toArray()
