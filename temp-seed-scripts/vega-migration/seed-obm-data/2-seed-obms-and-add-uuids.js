const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreObms = await pulseCoreDb.collection('organizations')
    .find({ type: 'Oncology Benefit Manager' }).toArray()

  const ops = coreObms.map(async ({ _id, ...body }) => {
    const uuid = uuid4()

    const vegaObmInput = {
      id: uuid,
      name: body.organization,
      name_tiny: body.organizationTiny,
      slug: body.slug,
      start: body.start,
      business_model: body.businessModel,
      approval_time: body.approvalTime,
      treatment_selection: body.treatmentSelection,
      has_decision_support: body.hasDecisionSupport,
      has_pb_mb_authorization: body.hasPbMbAuthorization,
      is_emr_integrable: body.isEmrIntegrable,
      medical_review: body.medicalReview,
      lab_benefit_manager: body.labBenefitManager,
      parent_company: body.parentCompany,
      payer: body.payer,
      pharmacy_benefit_manager: body.pharmacyBenefitManager,
      specialty_pharmacy: body.specialtyPharmacy,
    }

    await axios.post('obms/', vegaObmInput)
      .catch(e => { throw new Error(e) })

    await pulseCoreDb.collection('organizations')
      .updateOne({ _id }, { $set: { uuid } })
  })

  await Promise.all(ops)

  console.log('Mongo obms\' uuids populated and Vega obms seeded')
}
