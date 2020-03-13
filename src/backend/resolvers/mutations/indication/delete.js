const { ObjectId } = require('mongodb')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseCoreDb, coreRoles, mongoClient },
  info,
) => {
  const _id = ObjectId(indicationId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: remove all indications (with nested regimens) from roles' resources
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans._id': _id,
      },
      {
        $pull: {
          'resources.$[].treatmentPlans': { _id }
        }
      },
      { session },
    )

    // STEP 2: find all treatmentPlans with deleted indication
    const treatmentPlans = await pulseCoreDb.collection('treatmentPlans')
      .find(
        { indication: _id },
        { session },
      )
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    // STEP 3: delete `organizations.treatmentPlans` docs for each deleted `treatmentPlan`
    await pulseCoreDb
      .collection('organizations.treatmentPlans')
      .deleteMany(
        {
          treatmentPlanId: { $in: tpIds },
        },
        { session },
      )

    // Bonus Step: Get enriched trash docs for STEP 7
    const uncleanTrashDocs = await pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .aggregate(
        getTrashPipeline(tpIds),
        { session },
      )
      .toArray()

    // STEP 4: delete `organizations.treatmentPlans.history` docs for each deleted `treatmentPlan`
    await pulseCoreDb.collection('organizations.treatmentPlans.history')
      .deleteMany(
        {
          treatmentPlanId: { $in: tpIds },
        },
        { session },
      )

    // STEP 5: delete treatmentPlans with deleted indication
    await pulseCoreDb.collection('treatmentPlans')
      .deleteMany(
        { indication: _id },
        { session },
      )

    // STEP 6: delete indication itself
    const { value } = await pulseCoreDb.collection('indications').deleteOne(
      { _id },
      { session },
    )

    // STEP 7: add deleted `organizations.treatmentPlans.history` docs (now enriched) to trash
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

    result = value
  })

  return result
}

module.exports = deleteSourceIndication

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

