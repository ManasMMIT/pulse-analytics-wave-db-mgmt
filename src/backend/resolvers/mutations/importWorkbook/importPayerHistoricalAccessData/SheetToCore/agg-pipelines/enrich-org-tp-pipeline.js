module.exports = [
  {
    $lookup: {
      from: "treatmentPlans",
      localField: "treatmentPlanId",
      foreignField: "_id",
      as: "treatmentPlan"
    }
  },
  {
    $lookup: {
      from: "indications",
      localField: "treatmentPlan.indication",
      foreignField: "_id",
      as: "indication"
    }
  },
  {
    $lookup: {
      from: "regimens",
      localField: "treatmentPlan.regimen",
      foreignField: "_id",
      as: "regimen"
    }
  },
  {
    $lookup: {
      from: "lines",
      localField: "treatmentPlan.line",
      foreignField: "_id",
      as: "line"
    }
  },
  {
    $lookup: {
      from: "populations",
      localField: "treatmentPlan.population",
      foreignField: "_id",
      as: "population"
    }
  },
  {
    $lookup: {
      from: "books",
      localField: "treatmentPlan.book",
      foreignField: "_id",
      as: "book"
    }
  },
  {
    $lookup: {
      from: "coverages",
      localField: "treatmentPlan.coverage",
      foreignField: "_id",
      as: "coverage"
    }
  },
  {
    $lookup: {
      from: "organizations",
      localField: "organizationId",
      foreignField: "_id",
      as: "organization"
    }
  },
  {
    $project: {
      treatmentPlanId: 1,
      organizationId: 1,
      organization: {
        $arrayElemAt: ["$organization", 0]
      },
      indication: {
        $arrayElemAt: ["$indication", 0]
      },
      regimen: {
        $arrayElemAt: ["$regimen", 0]
      },
      population: {
        $arrayElemAt: ["$population", 0]
      },
      line: {
        $arrayElemAt: ["$line", 0]
      },
      book: {
        $arrayElemAt: ["$book", 0]
      },
      coverage: {
        $arrayElemAt: ["$coverage", 0]
      }
    }
  },
  {
    $project: {
      treatmentPlanId: 1,
      organizationId: 1,
      slug: "$organization.slug",
      organization: "$organization.organization",
      indication: "$indication.name",
      regimen: "$regimen.name",
      population: "$population.name",
      line: "$line.name",
      book: "$book.name",
      coverage: "$coverage.name"
    }
  }
];
