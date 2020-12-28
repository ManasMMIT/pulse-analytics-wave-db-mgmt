const getCascadePolicy = ({ input, pulseDevDb, session }) => [
  {
    input,
    into: {
      db: pulseDevDb,
      coll: 'users.nodes.resources',
      options: {
        session,
        arrayFilters: [
          { 'resource.accounts': { $exists: true } },
          { 'el._id': input._id },
        ],
      },
    },
    fieldMap: [
      {
        foreignField: 'resources.$[resource].accounts.$[el].slug',
        localField: 'slug',
      },
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'lbms',
      findObj: { _id: input._id },
    },
    fieldMap: [
      'businessModel',
      'organization',
      'organizationTiny',
      'slug',
      'start',
      'approvalTime',
      'hasDecisionSupport',
      'hasPbMbAuthorization',
      'isEmrIntegrable',
      'medicalReview',
      'treatmentSelection',
      'payer',
      'pharmacyBenefitManager',
      'specialtyPharmacy',
      'oncologyBenefitManager',
      'parentCompany',
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'lbmsServices',
      findObj: { 'lbm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'lbm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'lbm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'lbm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'lbmsPayers',
      findObj: { 'lbm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'lbm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'lbm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'lbm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'lbmsInfluencers',
      findObj: { 'lbm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'lbm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'lbm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'lbm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
]

export default getCascadePolicy
