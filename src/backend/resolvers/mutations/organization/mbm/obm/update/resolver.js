const { ObjectId } = require('mongodb')
const axios = require('axios')

const cascadePolicyUpdate = require('../../../../utils/cascadePolicyUpdate')
const getCascadePolicy = require('./getCascadePolicy')

const updateObmOrganization = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)
  // ! Vega Op
  // ? Looking up obm doc for uuid, instead of passing from frontend
  const { uuid } = await pulseCoreDb
    .collection('organizations')
    .findOne({ _id })

  if (uuid) {
    const vegaInput = {
      name: body.organization,
      name_tiny: body.organizationTiny,
      slug: body.slug,
      start: body.start,
      business_model: body.businessModel,
      approval_time: body.approvalTime,
      has_decision_support: body.hasDecisionSupport,
      has_pb_mb_authorization: body.hasPbMbAuthorization,
      is_emr_integrable: body.isEmrIntegrable,
      medical_review: body.medicalReview,
      treatment_selection: body.treatmentSelection,
      lab_benefit_manager: body.labBenefitManager,
      parent_company: body.parentCompany,
      payer: body.payer,
      pharmacy_benefit_manager: body.pharmacyBenefitManager,
      specialty_pharmacy: body.specialtyPharmacy,
    }

    // ! NOTE: Trailing slash is REQUIRED
    await axios.patch(`obms/${uuid}/`, vegaInput).catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
  }

  // ! Mongo Ops
  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )

    result = value

    const cascadePolicy = getCascadePolicy({
      input: result,
      pulseDevDb,
      session,
    })

    await Promise.all(cascadePolicy.map(cascadePolicyUpdate))
  })

  return result
}

module.exports = updateObmOrganization
