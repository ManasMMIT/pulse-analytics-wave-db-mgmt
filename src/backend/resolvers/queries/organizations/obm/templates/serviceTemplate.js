const serviceTemplateObms = async (
  parent,
  args,
  { pulseCoreDb },
) => pulseCoreDb.collection('organizations')
  .aggregate(SERVICE_TEMPLATE_AGG)
  .toArray()

module.exports = serviceTemplateObms

const SERVICE_TEMPLATE_AGG = [
  {
    '$match': {
      'type': 'Oncology Benefit Manager'
    }
  }, {
    '$lookup': {
      'from': 'obm_obm.services',
      'localField': '_id',
      'foreignField': 'obmId',
      'as': 'obmServices'
    }
  }, {
    '$unwind': {
      'path': '$obmServices',
      'preserveNullAndEmptyArrays': true
    }
  }, {
    '$project': {
      '_id': 0,
      'obmId': '$_id',
      'organization': '$organization',
      'obmServiceId': '$obmServices.obmServiceId',
      'rating': '$obmServices.rating'
    }
  }, {
    '$lookup': {
      'from': 'obm.services',
      'localField': 'obmServiceId',
      'foreignField': '_id',
      'as': 'service'
    }
  }, {
    '$addFields': {
      'service': {
        '$arrayElemAt': [
          '$service', 0
        ]
      }
    }
  }, {
    '$lookup': {
      'from': 'obm.services_obm.services.categories',
      'localField': 'service._id',
      'foreignField': 'obmServiceId',
      'as': 'serviceCategoryJoin'
    }
  }, {
    '$project': {
      'obmId': 1,
      'organization': 1,
      'serviceId': '$service._id',
      'serviceCategoryJoin': {
        '$arrayElemAt': [
          '$serviceCategoryJoin', 0
        ]
      },
      'service': '$service.name',
      'serviceRating': '$rating'
    }
  }, {
    '$lookup': {
      'from': 'obm.services.categories',
      'localField': 'serviceCategoryJoin.obmServiceCategoryId',
      'foreignField': '_id',
      'as': 'serviceCategory'
    }
  }, {
    '$addFields': {
      'serviceCategoryId': '$serviceCategoryJoin.obmServiceCategoryId',
      'serviceCategory': {
        '$arrayElemAt': [
          '$serviceCategory', 0
        ]
      }
    }
  }, {
    '$project': {
      'obmId': 1,
      'serviceId': 1,
      'serviceCategoryId': 1,
      'organization': 1,
      'service': 1,
      'serviceRating': 1,
      'serviceCategory': '$serviceCategory.name'
    }
  }
]
