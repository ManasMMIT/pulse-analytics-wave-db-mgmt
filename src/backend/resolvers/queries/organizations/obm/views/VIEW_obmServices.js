const VIEW_obmServices = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('organizations').aggregate(VIEW_AGG).toArray()

module.exports = VIEW_obmServices

const VIEW_AGG = [
  {
    $match: {
      type: 'Oncology Benefit Manager',
    },
  },
  {
    $lookup: {
      from: 'JOIN_obms_obms.services',
      localField: '_id',
      foreignField: 'obmId',
      as: 'obmServices',
    },
  },
  {
    $unwind: {
      path: '$obmServices',
    },
  },
  {
    $project: {
      _id: '$obmServices._id',
      obmId: '$_id',
      organization: '$organization',
      obmServiceId: '$obmServices.obmServiceId',
      rating: '$obmServices.rating',
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
      obmId: 1,
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
      obmId: 1,
      serviceId: 1,
      serviceCategoryId: 1,
      organization: 1,
      service: 1,
      serviceRating: 1,
      serviceCategory: '$serviceCategory.name',
    },
  },
]
