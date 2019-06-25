module.exports = [
  {
    $match: {
      regimen: 'Kymriah'
    }
  },
  {
    $lookup: {
      from: 'payerHistoricalDrgStateLives',
      localField: 'slug',
      foreignField: 'slug',
      as: 'stateLives'
    }
  },
  {
    $unwind: '$stateLives'
  },
  {
    $project: {
      _id: 0,
      STATE_CD: '$stateLives.state',
      STATE_NAME: '$stateLives.stateLong',
      PLAN_NAME: '$organization',
      LIVES: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$book', 'Commercial'] },
              then: '$stateLives.commercialMedical',
            },
            {
              case: { $eq: ['$book', 'Medicare'] },
              then: '$stateLives.medicareMedical',
            },
            {
              case: { $eq: ['$book', 'Medicare Advantage'] },
              then: '$stateLives.medicareMedical',
            },
            {
              case: { $eq: ['$book', 'Managed Medicaid'] },
              then: '$stateLives.managedMedicaidMedical',
            },
            {
              case: { $eq: ['$book', 'FFS Medicaid'] },
              then: '$stateLives.ffsMedicaidMedical',
            },
            {
              case: { $eq: ['$book', 'VA'] },
              then: '$stateLives.vaMedical',
            },
            {
              case: { $eq: ['$book', 'Tricare'] },
              then: '$stateLives.tricareMedical',
            },
          ]
        }
      },
      PLAN_TYPE: '$book',
      INDICATION: '$indication',
      PA_URL: '$policyLink',
      RESTRICTION_CODE: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$access', 'PA to Label; Additional Criteria'] },
              then: 'PA'
            },
            {
              case: { $eq: ['$access', 'PA to Label'] },
              then: 'PA'
            },
            {
              case: { $eq: ['$access', 'PA Required; Criteria Unavailable'] },
              then: 'PA'
            },
            {
              case: { $eq: ['$access', 'PA More Restrictive Than Label'] },
              then: 'PA'
            }
          ],
          default: '$access'
        }
      },
      RESTRICTION_DETAIL_TEXT: '$additionalCriteria',
      PROD_NAME: '$regimen',
    }
  },
  {
    $addFields: {
      PLAN_ID: null,
      PLAN_RANK: null,
      TIER: null,
      TIER_NUMBER: null,
      DW_INS_DT: null,
      RETAIL_COPAY_MIN: null,
      RETAIL_COPAY_MAX: null,
      MO_COPAY_MIN: null,
      MO_COPAY_MAX: null,
    }
  }
]
