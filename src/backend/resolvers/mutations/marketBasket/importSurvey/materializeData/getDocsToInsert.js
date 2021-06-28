const FALSEY_VALUES_MAP = require('./../utils/falsey-values-map')

module.exports = ({
  surveyQuestionsAndAnswers,
  survey,
  stakeholderSpecialtyMap,
  stakeholderMap,
}) => {
  return surveyQuestionsAndAnswers
    .filter(({ rating }) => !FALSEY_VALUES_MAP[rating])
    .map(
      ({
        category_id,
        category_name,
        category_prompt,
        category_type,
        characteristic_id,
        characteristic_name,
        characteristic_description,
        product_id,
        product_generic_name,
        product_brand_name,
        regimen_id,
        regimen_name,
        manufacturer_id,
        manufacturer_name,
        person_id,
        primary_role_id,
        primary_role,
        primary_role_type,
        primary_role_type_id,
        answer_id,
        rating,
      }) => {
        let productObj
        if (product_id) {
          productObj = {
            _id: product_id,
            genericName: product_generic_name,
            brandName: product_brand_name,
          }
        }

        let regimenObj
        if (regimen_id) {
          regimenObj = {
            _id: regimen_id,
            name: regimen_name,
          }
        }

        let manufacturerObj
        if (manufacturer_id) {
          manufacturerObj = {
            _id: manufacturer_id,
            name: manufacturer_name,
          }
        }

        let providerDataObj = {
          providerId: null,
          providerType: null,
          providerCommunityPracticeNetwork: null,
          providerInstitutions: null,
        }

        const { perception_tool_provider } = stakeholderMap[person_id]
        if (perception_tool_provider) {
          let materializedCommunityPracticeNetwork
          if (perception_tool_provider.community_practice_network) {
            materializedCommunityPracticeNetwork = {
              _id: perception_tool_provider.community_practice_network.id,
              name: perception_tool_provider.community_practice_network.name,
            }
          }

          const materializedInstitutions = perception_tool_provider.institutions.map(
            ({ id, name }) => ({ _id: id, name })
          )

          providerDataObj = {
            providerId: perception_tool_provider.id,
            providerType: perception_tool_provider.type,
            providerCommunityPracticeNetwork:
              materializedCommunityPracticeNetwork || null,
            providerInstitutions: materializedInstitutions,
          }
        }

        return {
          _id: answer_id,
          surveyId: survey.id,
          marketBasketId: survey.market_basket,
          surveyDate: new Date(survey.date),
          category: {
            _id: category_id,
            name: category_name,
            prompt: category_prompt,
            type: category_type,
          },
          characteristic: {
            _id: characteristic_id,
            name: characteristic_name,
            description: characteristic_description,
          },
          regimen: regimenObj,
          product: productObj,
          manufacturer: manufacturerObj,
          rating,
          stakeholder: {
            _id: person_id,
            primaryRoleId: primary_role_id,
            primaryRole: primary_role,
            primaryRoleType: primary_role_type,
            primaryRoleTypeId: primary_role_type_id,
            roleSpecialty: stakeholderSpecialtyMap[person_id]
              ? stakeholderSpecialtyMap[person_id].specialty_label
              : null,
            roleSpecialtyId: stakeholderSpecialtyMap[person_id]
              ? stakeholderSpecialtyMap[person_id].id
              : null,
            ...providerDataObj,
          },
        }
      }
    )
}
