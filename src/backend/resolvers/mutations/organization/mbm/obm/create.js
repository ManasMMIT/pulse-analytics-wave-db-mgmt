const axios = require('axios')
const { v4: uuid } = require('uuid')

const { MBM_TOOL_ID } = require('../../../../../global-tool-ids')

const createObmAccount = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  // ! VEGA POST OP
  const vegaId = uuid()

  const vegaObmInput = {
    id: vegaId,
    name: input.organization,
    name_tiny: input.organizationTiny,
    slug: input.slug,
    start: input.start,
    business_model: input.businessModel,
    approval_time: input.approvalTime,
    has_decision_support: input.hasDecisionSupport,
    has_pb_mb_authorization: input.hasPbMbAuthorization,
    is_emr_integrable: input.isEmrIntegrable,
    medical_review: input.medicalReview,
    treatment_selection: input.treatmentSelection,
    lab_benefit_manager: input.labBenefitManager,
    parent_company: input.parentCompany,
    payer: input.payer,
    pharmacy_benefit_manager: input.pharmacyBenefitManager,
    specialty_pharmacy: input.specialtyPharmacy,
  }

  await axios.post('obms/', vegaObmInput).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  // ! MONGO POST OP
  let createdObm

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    createdObm = await pulseCoreDb
      .collection('organizations')
      .insertOne(
        {
          ...input,
          uuid: vegaId,
          type: 'Oncology Benefit Manager',
          toolIds: [MBM_TOOL_ID],
        },
        { session }
      )
      .then(({ ops }) => ops[0])

    const { type, toolIds, ...devObm } = createdObm

    await pulseDevDb.collection('obms').insertOne(devObm, { session })
  })

  return createdObm
}

module.exports = createObmAccount
