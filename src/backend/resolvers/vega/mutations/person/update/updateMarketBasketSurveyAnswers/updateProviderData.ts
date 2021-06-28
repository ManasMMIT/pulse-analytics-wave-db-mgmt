const DEFAULT_SET_OBJ = {
  'stakeholder.providerId': null,
  'stakeholder.providerType': null,
  'stakeholder.providerCommunityPracticeNetwork': null,
  'stakeholder.providerInstitutions': null,
}

async function updateProviderData(pulseDevDb: any, updatedPerson: any) {
  const { perception_tool_provider } = updatedPerson
  let $set = DEFAULT_SET_OBJ

  if (perception_tool_provider) {
    let materializedCommunityPracticeNetwork
    if (perception_tool_provider.community_practice_network) {
      materializedCommunityPracticeNetwork = {
        _id: perception_tool_provider.community_practice_network.id,
        name: perception_tool_provider.community_practice_network.name
      }
    }

    const materializedInstitutions = perception_tool_provider.institutions
      .map(({ id, name }) => ({ _id: id, name }))

    $set = {
      'stakeholder.providerId': perception_tool_provider.id,
      'stakeholder.providerType': perception_tool_provider.type,
      'stakeholder.providerCommunityPracticeNetwork': materializedCommunityPracticeNetwork || null,
      'stakeholder.providerInstitutions': materializedInstitutions,
    }
  }

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder._id': updatedPerson.id },
      { $set },
    )
}

export default updateProviderData

