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
      coll: 'obms',
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
      'labBenefitManager',
      'parentCompany',
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'obmsServices',
      findObj: { 'obm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'obm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'obm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'obm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'obmsPayers',
      findObj: { 'obm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'obm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'obm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'obm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
  {
    input,
    session,
    into: {
      db: pulseDevDb,
      coll: 'obmsInfluencers',
      findObj: { 'obm._id': input._id },
    },
    fieldMap: [
      {
        foreignField: 'obm.slug',
        localField: 'slug',
      },
      {
        foreignField: 'obm.organization',
        localField: 'organization',
      },
      {
        foreignField: 'obm.organizationTiny',
        localField: 'organizationTiny',
      },
    ],
  },
]

module.exports = getCascadePolicy
