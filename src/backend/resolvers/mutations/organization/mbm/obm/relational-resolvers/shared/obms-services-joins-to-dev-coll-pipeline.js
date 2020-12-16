module.exports = [
  {
    $lookup: {
      from: 'organizations',
      localField: 'obmId',
      foreignField: '_id',
      as: 'obm',
    },
  },
  {
    $lookup: {
      from: 'obms.services',
      localField: 'obmServiceId',
      foreignField: '_id',
      as: 'service',
    },
  },
  {
    $addFields: {
      service: {
        $arrayElemAt: ['$service', 0],
      },
      obm: {
        $arrayElemAt: ['$obm', 0],
      },
    },
  },
  {
    $lookup: {
      from: 'JOIN_obms.services_obms.services.categories',
      localField: 'service._id',
      foreignField: 'obmServiceId',
      as: 'serviceCategoryJoin',
    },
  },
  {
    $project: {
      obm: {
        _id: '$obm._id',
        slug: '$obm.slug',
        organization: '$obm.organization',
        organizationTiny: '$obm.organizationTiny',
      },
      serviceId: '$service._id',
      serviceCategoryJoin: {
        $arrayElemAt: ['$serviceCategoryJoin', 0],
      },
      service: '$service.name',
      serviceRating: '$rating',
      serviceDescription: '$service.description',
    },
  },
  {
    $lookup: {
      from: 'obms.services.categories',
      localField: 'serviceCategoryJoin.obmServiceCategoryId',
      foreignField: '_id',
      as: 'serviceCategory',
    },
  },
  {
    $addFields: {
      serviceCategoryId: '$serviceCategoryJoin.obmServiceCategoryId',
      serviceCategory: {
        $arrayElemAt: ['$serviceCategory', 0],
      },
    },
  },
  {
    $project: {
      obm: 1,
      service: {
        _id: '$serviceId',
        name: '$service',
        rating: '$serviceRating',
        category: '$serviceCategory.name',
        description: '$serviceDescription',
        categoryId: '$serviceCategoryId',
      },
    },
  },
  {
    $match: {
      'service.categoryId': {
        $exists: true,
      },
    },
  },
]
