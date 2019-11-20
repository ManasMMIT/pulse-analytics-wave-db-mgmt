const queryTool = async (parent, args, { pulseRawDb, pulseCoreDb }, info) => {
  const payerProvidersOCM = await pulseRawDb.collection('queryTool.phase0')
    .find(
      {
        $or: [
          { slugType1: 'Payer' },
          { slugType1: 'Provider' },
        ],
        slug: 'oncology-care-model',
      }
    )
    .toArray()

  // ! Only necessary while query tool data isn't part of organizations master list
  // ? Extra 6 organizations, when matching?
  const payerProvidersOCMWithInfo = await pulseCoreDb.collection('organizations')
    .find(
      {
        $and: [
          { slug: { $in: payerProvidersOCM.map(({ slug1 }) => slug1)} },
          {
            $or: [
              { type: 'Payer' },
              { type: 'Provider' },
            ]
          },
        ]
      }
    )
    .toArray()

  return payerProvidersOCMWithInfo
}

module.exports = queryTool
