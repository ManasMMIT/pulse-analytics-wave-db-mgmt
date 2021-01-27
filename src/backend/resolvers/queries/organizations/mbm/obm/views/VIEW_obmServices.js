const axios = require('axios')

const VIEW_obmServices = async (parent, args, { pulseCoreDb }) => {
  const mongoCoreObmIdMap = await pulseCoreDb
    .collection('organizations')
    .find()
    .toArray()
    .then((obms) =>
      obms.reduce((acc, obm) => ({ ...acc, [obm.uuid]: obm._id }), {})
    )

  return axios
    .get('obm-service-connections')
    .then(({ data }) =>
      data.map((datum) => {
        const obmId = mongoCoreObmIdMap[datum.obm.id]

        return {
          id: datum.id,
          obmId,
          serviceId: datum.obm_service.id,
          serviceCategoryId: datum.obm_service.category_id,
          organization: datum.obm.name,
          service: datum.obm_service.name,
          serviceRating: datum.rating,
          serviceCategory: datum.obm_service.category.name,
        }
      })
    )
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

module.exports = VIEW_obmServices
