const { ObjectId } = require('mongodb')

const deleteSourceRegimen = async (
  parent,
  { input: { _id: regimenId } },
  { mongoClient, coreRoles, pulseCoreDb },
  info,
) => {
  const _id = ObjectId(regimenId)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // STEP 1: Delete the regimen from all indications
    await pulseCoreDb.collection('indications').updateMany(
      { 'regimens._id': _id },
      { $pull: { regimens: { _id } } },
      { session },
    )

    // STEP 2: Delete the regimen from all teams' resources' treatmentPlans' regimens
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans.regimens._id': _id,
      },
      {
        $pull: {
          'resources.$[resource].treatmentPlans.$[].regimens': { _id },
        }
      },
      {
        arrayFilters: [
          { 'resource.treatmentPlans': { $exists: true } },
        ],
        session,
      },
    )

    // STEP 3: find all treatmentPlans with deleted regimen
    const treatmentPlans = await pulseCoreDb.collection('treatmentPlans')
      .find(
        { regimen: _id },
        { session },
      )
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    // Bonus Step: Get enriched trash docs
    const uncleanTrashDocs = await pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        getTrashPipeline(tpIds),
        { session },
      )
      .toArray()

    // STEP 4: delete `organizations.treatmentPlans` docs for each deleted `treatmentPlan`
    await pulseCoreDb
      .collection('organizations.treatmentPlans')
      .deleteMany(
        {
          treatmentPlanId: { $in: tpIds },
        },
        { session },
      )

    // STEP 5: delete `organizations.treatmentPlans.history` docs for each deleted `treatmentPlan`
    await pulseCoreDb.collection('organizations.treatmentPlans.history')
      .deleteMany(
        {
          treatmentPlanId: { $in: tpIds },
        },
        { session },
      )

    // STEP 6: delete treatmentPlans with deleted regimen
    await pulseCoreDb.collection('treatmentPlans')
      .deleteMany(
        { regimen: _id },
        { session },
      )

    // STEP 7: Delete the regimen from `regimens` collection
    result = await pulseCoreDb.collection('regimens').findOneAndDelete(
      { _id },
      { session },
    )

    result = result.value

    // STEP 8: add deleted `organizations.treatmentPlans.history` docs (now enriched) to trash
    // ! can't be held in transaction, so done as last op
    const cleanTrashDocs = uncleanTrashDocs.map(({ _id, ...doc }) => doc)

    if (cleanTrashDocs.length) {
      await pulseCoreDb
        .collection('trash.organizations.treatmentPlans.history')
        .insertMany(
          cleanTrashDocs,
          // { session }, // breaks transaction limit on insertion
        )
    }
  })

  return result
}

module.exports = deleteSourceRegimen

const getTrashPipeline = _ids => [
  {
    '$match': {
      'treatmentPlanId': { $in: _ids },
    }
  },
  {
    '$lookup': {
      'from': 'organizations',
      'localField': 'organizationId',
      'foreignField': '_id',
      'as': 'orgData'
    }
  }, {
    '$lookup': {
      'from': 'treatmentPlans',
      'localField': 'treatmentPlanId',
      'foreignField': '_id',
      'as': 'tpData'
    }
  }, {
    '$addFields': {
      'org': {
        '$arrayElemAt': [
          '$orgData', 0
        ]
      },
      'tp': {
        '$arrayElemAt': [
          '$tpData', 0
        ]
      }
    }
  }, {
    '$project': {
      'organizationId': 1,
      'treatmentPlanId': 1,
      'slug': '$org.slug',
      'indication': '$tp.indication',
      'regimen': '$tp.regimen',
      'population': '$tp.population',
      'line': '$tp.line',
      'book': '$tp.book',
      'coverage': '$tp.coverage',
      'additionalCriteriaData': 1,
      'policyLinkData': 1,
      'project': 1,
      'timestamp': 1,
      'tierData': 1,
      'accessData': 1
    }
  }, {
    '$lookup': {
      'from': 'indications',
      'localField': 'indication',
      'foreignField': '_id',
      'as': 'indication'
    }
  }, {
    '$lookup': {
      'from': 'regimens',
      'localField': 'regimen',
      'foreignField': '_id',
      'as': 'regimen'
    }
  }, {
    '$lookup': {
      'from': 'populations',
      'localField': 'population',
      'foreignField': '_id',
      'as': 'population'
    }
  }, {
    '$lookup': {
      'from': 'lines',
      'localField': 'line',
      'foreignField': '_id',
      'as': 'line'
    }
  }, {
    '$lookup': {
      'from': 'books',
      'localField': 'book',
      'foreignField': '_id',
      'as': 'book'
    }
  }, {
    '$lookup': {
      'from': 'coverages',
      'localField': 'coverage',
      'foreignField': '_id',
      'as': 'coverage'
    }
  }, {
    '$addFields': {
      'indication': {
        '$arrayElemAt': [
          '$indication', 0
        ]
      },
      'regimen': {
        '$arrayElemAt': [
          '$regimen', 0
        ]
      },
      'population': {
        '$arrayElemAt': [
          '$population', 0
        ]
      },
      'line': {
        '$arrayElemAt': [
          '$line', 0
        ]
      },
      'book': {
        '$arrayElemAt': [
          '$book', 0
        ]
      },
      'coverage': {
        '$arrayElemAt': [
          '$coverage', 0
        ]
      }
    }
  }, {
    '$addFields': {
      'indication': '$indication.name',
      'regimen': '$regimen.name',
      'population': '$population.name',
      'line': '$line.name',
      'book': '$book.name',
      'coverage': '$coverage.name'
    }
  }
]
