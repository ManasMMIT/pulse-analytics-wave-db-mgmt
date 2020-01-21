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
      PayerName: '$organization',
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
      PLAN_TYPE: {
        $switch: {
          branches: [
            {
              case: { $eq: ['$book', 'Medicare'] },
              then: 'Medicare Advantage',
            },
            {
              case: { $eq: ['$book', 'FFS Medicaid'] },
              then: 'State Medicaid',
            },
          ],
          default: '$book'
        }
      },
      INDICATION: '$indication',
      URL_TO_PA_Policy: { $ifNull: [ "$siteLink", "Not Available" ] },
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
      PA_URL: { $ifNull: [ "$paLink", "Not Available" ] }
    }
  },
  {
    $addFields: {
      PLAN_NAME: null,
      PLAN_ID: null,
      TIER: null,
      TIER_NUMBER: null,
      DW_INS_DT: null,
    }
  }
]
