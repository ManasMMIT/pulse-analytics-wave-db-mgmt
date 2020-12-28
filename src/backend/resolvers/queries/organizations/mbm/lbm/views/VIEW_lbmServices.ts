const VIEW_AGG = [
  {
    $match: {
      type: 'Laboratory Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'JOIN_lbms_lbms.services',
      localField: '_id',
      foreignField: 'lbmId',
      as: 'lbmServices',
    },
  },
  {
    $unwind: {
      path: '$lbmServices',
    },
  },
  {
    $project: {
      _id: '$lbmServices._id',
      lbmId: '$_id',
      organization: '$organization',
      lbmServiceId: '$lbmServices.lbmServiceId',
      rating: '$lbmServices.rating',
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
      lbmId: 1,
      organization: 1,
      serviceId: '$service._id',
      serviceCategoryJoin: {
        $arrayElemAt: ['$serviceCategoryJoin', 0],
      },
      service: '$service.name',
      serviceRating: '$rating',
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
      lbmId: 1,
      serviceId: 1,
      serviceCategoryId: 1,
      organization: 1,
      service: 1,
      serviceRating: 1,
      serviceCategory: '$serviceCategory.name',
    },
  },
]

const VIEW_lbmServices = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').aggregate(VIEW_AGG).toArray()

export default VIEW_lbmServices

