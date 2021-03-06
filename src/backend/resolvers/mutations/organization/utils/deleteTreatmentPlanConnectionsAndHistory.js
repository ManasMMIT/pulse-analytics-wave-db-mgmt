const { ObjectId } = require('mongodb')

module.exports = async ({
  db,
  session,
  organizationId,
}) => {
  organizationId = new ObjectId(organizationId)

  // STEP 1: find all affiliated `organizations.treatmentPlans` docs 
  const orgTps = await db
    .collection('organizations.treatmentPlans')
    .find(
      {
        organizationId,
      },
      { session },
    ).toArray()

  const orgTpIds = orgTps.map(({ _id }) => _id)

  // STEP 2: Delete any affiliated PTPs from the tdgProjects collection
  await db
    .collection('tdgProjects')
    .updateMany(
      {},
      {
        $pull: {
          orgTpIds: { $in: orgTpIds },
          extraOrgTpIds: { $in: orgTpIds },
        }
      },
      { session }
    )

  // STEP 3: Delete affiliated `organizations.treatmentPlans` docs 
  await db
    .collection('organizations.treatmentPlans')
    .deleteMany(
      { organizationId },
      { session },
    )

  // STEP 4: Find historical docs for organization in history and enrich with data
  const enrichedTrashDocs = await db
    .collection('organizations.treatmentPlans.history')
    .aggregate(getEnrichOrgTpHistoryTrashPipeline(organizationId), { session })
    .toArray()

  const trashDocsToInsert = enrichedTrashDocs.map(({ _id, ...doc }) => doc)

  // STEP 5: Insert trash docs only if there are any
  if (trashDocsToInsert.length) {
    await db
      .collection('trash.organizations.treatmentPlans.history')
      .insertMany(trashDocsToInsert, { session })

    // 4. delete all historical documents only if they exist
    await db
      .collection('organizations.treatmentPlans.history')
      .deleteMany({ organizationId }, { session })
  }

  return enrichedTrashDocs
}

const getEnrichOrgTpHistoryTrashPipeline = _id => [
  {
    '$match': {
      'organizationId': _id,
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
