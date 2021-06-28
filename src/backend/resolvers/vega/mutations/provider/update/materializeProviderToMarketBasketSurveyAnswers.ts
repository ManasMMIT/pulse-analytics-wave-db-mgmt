async function materializeProviderToMarketBasketSurveyAnswers(updatedProvider: any, pulseDevDb: any) {
  const materializedCommunityPracticeNetwork = updatedProvider.community_practice_network
    ? {
      _id: updatedProvider.community_practice_network.id,
      name: updatedProvider.community_practice_network.name
    }
    : null

  const materializedInstitutions = updatedProvider.institutions
    .map(({ id, name }) => ({ _id: id, name }))

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder.providerId': updatedProvider.id },
      {
        $set: {
          'stakeholder.providerType': updatedProvider.type,
          'stakeholder.providerCommunityPracticeNetwork': materializedCommunityPracticeNetwork,
          'stakeholder.providerInstitutions': materializedInstitutions,
        }
      }
    )
}

export default materializeProviderToMarketBasketSurveyAnswers
