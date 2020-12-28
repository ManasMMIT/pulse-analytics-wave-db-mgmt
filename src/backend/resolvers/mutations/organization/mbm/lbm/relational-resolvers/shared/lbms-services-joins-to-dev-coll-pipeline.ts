export default [
  {
    $lookup: {
      from: 'organizations',
      localField: 'lbmId',
      foreignField: '_id',
      as: 'lbm',
    },
  },
  {
    $lookup: {
      from: 'lbms.services',
      localField: 'lbmServiceId',
      foreignField: '_id',
      as: 'service',
    },
  },
  {
    $addFields: {
      service: {
        $arrayElemAt: ['$service', 0],
      },
      lbm: {
        $arrayElemAt: ['$lbm', 0],
      },
    },
  },
  {
    $lookup: {
      from: 'JOIN_lbms.services_lbms.services.categories',
      localField: 'service._id',
      foreignField: 'lbmServiceId',
      as: 'serviceCategoryJoin',
    },
  },
  {
    $project: {
      lbm: {
        _id: '$lbm._id',
        slug: '$lbm.slug',
        organization: '$lbm.organization',
        organizationTiny: '$lbm.organizationTiny',
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
      from: 'lbms.services.categories',
      localField: 'serviceCategoryJoin.lbmServiceCategoryId',
      foreignField: '_id',
      as: 'serviceCategory',
    },
  },
  {
    $addFields: {
      serviceCategoryId: '$serviceCategoryJoin.lbmServiceCategoryId',
      serviceCategory: {
        $arrayElemAt: ['$serviceCategory', 0],
      },
    },
  },
  {
    $project: {
      lbm: 1,
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
