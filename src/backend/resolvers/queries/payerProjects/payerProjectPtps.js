const { ObjectId } = require('mongodb')

module.exports = (
  parent,
  {
    input: {
      projectId,
    }
  },
  { pulseCoreDb }
) => {
  projectId = ObjectId(projectId)

  const aggPipeline = getAggPipeline(projectId)

  return pulseCoreDb.collection('tdgProjects')
    .aggregate(aggPipeline)
    .toArray()
}

const getAggPipeline = projectId => [{
  $match: {
    _id: projectId
  }
}, {
  $project: {
    name: 1,
    allOrgTpIds: {
      $concatArrays: [
        { $ifNull: ['$orgTpIds', []] },
        { $ifNull: ['$extraOrgTpIds', []] },
      ]
    }
  }
}, {
  $lookup: {
    from: 'organizations.treatmentPlans',
    localField: 'allOrgTpIds',
    foreignField: '_id',
    as: 'allOrgTpIds'
  }
}, { $unwind: '$allOrgTpIds' }, {
  $lookup: {
    from: 'tdgProjects',
    localField: 'allOrgTpIds._id',
    foreignField: 'orgTpIds',
    as: 'allOrgTpIds.project'
  }
}, {
  $replaceRoot: {
    newRoot: '$allOrgTpIds'
  }
}, {
  $addFields: {
    project: {
      $arrayElemAt: ['$project.name', 0]
    }
  }
}, {
  $lookup: {
    from: 'treatmentPlans',
    localField: 'treatmentPlanId',
    foreignField: '_id',
    as: 'treatmentPlan'
  }
}, {
  $addFields: {
    treatmentPlan: {
      $arrayElemAt: [
        '$treatmentPlan',
        0
      ]
    }
  }
}, {
  $lookup: {
    from: 'indications',
    localField: 'treatmentPlan.indication',
    foreignField: '_id',
    as: 'indication'
  }
}, {
  $lookup: {
    from: 'regimens',
    localField: 'treatmentPlan.regimen',
    foreignField: '_id',
    as: 'regimen'
  }
}, {
  $lookup: {
    from: 'lines',
    localField: 'treatmentPlan.line',
    foreignField: '_id',
    as: 'line'
  }
}, {
  $lookup: {
    from: 'populations',
    localField: 'treatmentPlan.population',
    foreignField: '_id',
    as: 'population'
  }
}, {
  $lookup: {
    from: 'books',
    localField: 'treatmentPlan.book',
    foreignField: '_id',
    as: 'book'
  }
}, {
  $lookup: {
    from: 'coverages',
    localField: 'treatmentPlan.coverage',
    foreignField: '_id',
    as: 'coverage'
  }
}, {
  $lookup: {
    from: 'organizations',
    localField: 'organizationId',
    foreignField: '_id',
    as: 'organization'
  }
}, {
  $project: {
    organization: {
      $arrayElemAt: [
        '$organization',
        0
      ]
    },
    indication: {
      $arrayElemAt: [
        '$indication',
        0
      ]
    },
    regimen: {
      $arrayElemAt: [
        '$regimen',
        0
      ]
    },
    population: {
      $arrayElemAt: [
        '$population',
        0
      ]
    },
    line: {
      $arrayElemAt: [
        '$line',
        0
      ]
    },
    book: {
      $arrayElemAt: [
        '$book',
        0
      ]
    },
    coverage: {
      $arrayElemAt: [
        '$coverage',
        0
      ]
    },
    project: 1,
    treatmentPlanId: 1,
    organizationId: 1,
  }
}, {
  $project: {
    slug: '$organization.slug',
    organization: '$organization.organization',
    organizationTiny: '$organization.organizationTiny',
    indication: '$indication.name',
    regimen: '$regimen.name',
    population: '$population.name',
    line: '$line.name',
    book: '$book.name',
    coverage: '$coverage.name',
    project: 1,
    treatmentPlanId: 1,
    organizationId: 1,
  }
}]
