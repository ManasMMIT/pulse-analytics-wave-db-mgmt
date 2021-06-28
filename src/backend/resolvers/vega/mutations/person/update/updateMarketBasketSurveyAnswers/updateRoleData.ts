import axios from 'axios'
import _ from 'lodash'

async function updateRoleData(pulseDevDb: any, updatedPerson: any) {
  await updateStakeholderRoleAndRoleType(pulseDevDb, updatedPerson)
  await updateStakeholderRoleSpecialties(updatedPerson, pulseDevDb)
}

export default updateRoleData

async function updateStakeholderRoleAndRoleType(pulseDevDb: any, updatedPerson: any) {
  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      { 'stakeholder._id': updatedPerson.id },
      {
        $set: {
          'stakeholder.primaryRoleId': updatedPerson.role && updatedPerson.role.id,
          'stakeholder.primaryRole': updatedPerson.role && updatedPerson.role.name,
          'stakeholder.primaryRoleType': updatedPerson.role && updatedPerson.role.type && updatedPerson.role.type.name,
          'stakeholder.primaryRoleTypeId': updatedPerson.role && updatedPerson.role.type && updatedPerson.role.type.id,
        }
      }
    )
}

async function updateStakeholderRoleSpecialties(updatedPerson: any, pulseDevDb: any) {
  const hydratedMarketBaskets = await axios
    .get(`hydrated-market-baskets/`)
    .then(({ data }) => data)

  const indicationToMarketBasketsMap = _.groupBy(
    hydratedMarketBaskets,
    ({ indication: { id } }) => id
  )

  await pulseDevDb.collection('marketBasketsSurveyAnswers')
    .updateMany(
      {
        'stakeholder._id': updatedPerson.id,
        'stakeholder.roleSpecialtyId': { $nin: updatedPerson.role_specialties.map(({ id }) => id) }
      },
      {
        $set: {
          'stakeholder.roleSpecialtyId': null,
          'stakeholder.roleSpecialty': null,
        }
      }
    )

  const specialtyOps = updatedPerson.role_specialties.map(({
    id: roleSpecialtyId,
    specialty_label: roleSpecialty,
    indication: { id: specialtyIndicationId }
  }) => {
    const marketBasketIds = indicationToMarketBasketsMap[specialtyIndicationId]
      .map(({ id }) => id)

    return pulseDevDb.collection('marketBasketsSurveyAnswers')
      .updateMany(
        {
          marketBasketId: { $in: marketBasketIds },
          'stakeholder._id': updatedPerson.id,
        },
        {
          $set: {
            'stakeholder.roleSpecialtyId': roleSpecialtyId,
            'stakeholder.roleSpecialty': roleSpecialty,
          }
        }
      )
  })

  await Promise.all(specialtyOps)
}

