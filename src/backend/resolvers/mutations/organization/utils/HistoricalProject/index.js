const { ObjectId } = require('mongodb')
const _ = require('lodash')

const {
  ENRICH_TP_PARTS_PIPELINE,
  getProjectOrgTpsPipeline,
} = require('./agg-pipelines')

const MERCK_KEYTRUDA_PROJECT_ID = ObjectId('5e6812b82510ab0c89bdc215')

const TEST_DATE = '2019-12-01'
// const TEST_SHEET_NAME = 'MerckKeytruda-QualityAccess-11-20'
// const TEST_SHEET_DATA = require('./testQualityAccessSheetData')

// const TEST_SHEET_NAME = 'MerckKeytruda-AdditionalCriteri'
// const TEST_SHEET_DATA = require('./testAddCriteriaData')

const TEST_SHEET_NAME = 'MerckKeytruda-PolicyLinks-11-20'
const TEST_SHEET_DATA = require('./testPolicyLinksSheetData')

class HistoricalProjectData {
  constructor(projectId = MERCK_KEYTRUDA_PROJECT_ID) {
    this.projectId = projectId
  }

  getEnrichedOrgTpsOp() {
    return this.pulseCore
      .collection('tdgProjects')
      .aggregate(
        getProjectOrgTpsPipeline(this.projectId)
      )
      .toArray()
  }

  hashOrgTpParts({
    organizationId,
    treatmentPlanId,
  }) {
    return [organizationId, treatmentPlanId].join('|')
  }

  getAllowedOrgTpsHash(enrichedOrgTps) {
    return _.keyBy(
      enrichedOrgTps,
      this.hashOrgTpParts,
    )
  }

  getOrgsOp() {
    return this.pulseCore
      .collection('organizations')
      .find({ type: 'Payer' })
      .toArray()
  }

  getOrgsHashBySlug(orgs) {
    return _.keyBy(orgs, 'slug')
  }

  getTreatmentPlansWithPartsOp() {
    return this.pulseCore
      .collection('treatmentPlans')
      .aggregate(ENRICH_TP_PARTS_PIPELINE)
      .toArray()
  }

  hashTpParts(datum) {
    return [
      datum.indication,
      datum.regimen,
      datum.line,
      datum.population,
      datum.book,
      datum.coverage
    ].join('|')
  }

  POLICY_LINKS_hashTpParts(datum) {
    return [
      datum.regimen,
      datum.book,
      datum.coverage
    ].join('|')
  }

  getTreatmentPlansHashByParts(treatmentPlansWithParts) {
    return _.groupBy(
      treatmentPlansWithParts,
      this.selectedTpHasher,
    )
  }

  getAccessesOp() {
    return this.pulseCore
      .collection('qualityOfAccessScore')
      .find()
      .toArray()
  }

  getAccessHashByAccess(accesses) {
    return _.keyBy(
      accesses,
      'access',
    )
  }

  async setupHashes() {
    /*
      ? Note:
      Getting a hash is split into two parts for performance benefits

      1. Fetch appropriate date
      2. Group hash by desired fields
    */
    //

    const [
      [enrichedProjectDoc],
      orgs,
      treatmentPlansWithParts,
      qualityOfAccesses,
    ] = await Promise.all([
      this.getEnrichedOrgTpsOp(),
      this.getOrgsOp(),
      this.getTreatmentPlansWithPartsOp(),
      this.getAccessesOp(),
    ])

    this.allowedOrgTpsHash = this.getAllowedOrgTpsHash(enrichedProjectDoc.orgTps)
    this.orgsHashBySlug = this.getOrgsHashBySlug(orgs)

    this.treatmentPlansHashByParts = this.getTreatmentPlansHashByParts(treatmentPlansWithParts)

    this.qualityOfAccessHash = this.getAccessHashByAccess(qualityOfAccesses)
  }

  getFilteredAndEnrichedSheetData() {
    const copiedSheetData = _.cloneDeep(this.sheetData)

    return copiedSheetData.reduce((acc, datum) => {
      const organizationId = this.orgsHashBySlug[datum.slug]._id

      const tpHash = this.selectedTpHasher(datum)

      // ! policy link matches multiple treatmentPlans, so dynamically add docs to acc
      const treatmentPlans = this.treatmentPlansHashByParts[tpHash]

      if (!treatmentPlans || !organizationId) return acc

      treatmentPlans.forEach(treatmentPlan => {
        const treatmentPlanId = treatmentPlan._id

        const orgTpHash = this.hashOrgTpParts({
          organizationId,
          treatmentPlanId,
        })

        const orgTpId = this.allowedOrgTpsHash[orgTpHash]._id

        // ! Only persist valid orgTps in sheet data
        // ! And inject all ref IDs for ops
        if (orgTpId) {
          acc = [
            ...acc,
            { ...datum, orgTpId, treatmentPlanId, organizationId },
          ]
        }
      })

      return acc
    }, [])
  }

  getPermittedOps() {
    // 1. use input to get all hashes
    // 2. use allowedOrgTps to run getValidData function
    // 3. return permittedOps,
    /*
      ? permittedOp: {
        findObj: { OrgTpId, timestamp },
        setObj: { $set: PAYLOAD } // PAYLOAD is stuff like access and tier, non-relational stuff
      }
    */

    const isPolicyLinksSheet = /PolicyLinks/.test(this.sheetName)
    const isQualityAccessSheet = /QualityAccess/.test(this.sheetName)
    const isAdditionalCriteriaSheet = /AdditionalCriteria/.test(this.sheetName)

    const dataForOps = this.getFilteredAndEnrichedSheetData()

    return dataForOps.map(({
      orgTpId,
      access,
      tier,
      tierRating,
      tierTotal,
      treatmentPlanId,
      organizationId,
      dateTracked,
      paLink,
      policyLink,
      project,
      siteLink,
      link,
      criteria,
      criteriaNotes,
      lineOfTherapy,
      restrictionLevel,
      subPopulation,
    }) => {
      const setObj = {
        $set: {
          orgTpId,
          projectId: this.projectId, // ? good enough?
          treatmentPlanId,
          organizationId,
          timestamp: this.timestamp,
        }
      }

      if (isPolicyLinksSheet) {
        setObj.$set = {
          ...setObj.$set,
          policyLinkData: {
            dateTracked,
            link,
            paLink,
            policyLink,
            project,
            siteLink,
          }
        }
      } else if (isQualityAccessSheet) {
        setObj.$set = {
          ...setObj.$set,
          accessData: this.qualityOfAccessHash[access],
          tierData: {
            tier,
            tierRating,
            tierTotal,
          }
        }
      } else if (isAdditionalCriteriaSheet) {
        setObj.$set = {
          ...setObj.$set,
          additionalCriteriaData: {
            criteria,
            criteriaNotes,
            lineOfTherapy,
            restrictionLevel,
            subPopulation,
          }
        }
      } else {
        setObj.$set = {}
      }

      return ({
        findObj: { orgTpId, timestamp: this.timestamp },
        setObj,
      })
    })
  }

  async update({
    db,
    sheetData = TEST_SHEET_DATA,
    sheetName = TEST_SHEET_NAME,
    date = TEST_DATE,
  }) {
    this.pulseCore = db
    this.sheetName = sheetName
    this.sheetData = sheetData
    this.timestamp = new Date(date)
    /*
      The policyLink sheet only has a subset of treatmentPlan parts:
        - `coverage`
        - `book`
        - `regimen`

      Therefore, matching orgTpIds requires a different hash of fields to match treatmentPlans.
    */
    const isPolicyLinksSheet = /PolicyLinks/.test(sheetName)

    this.selectedTpHasher = isPolicyLinksSheet
      ? this.POLICY_LINKS_hashTpParts
      : this.hashTpParts

    // 1.  wait on setup steps to complete
    await this.setupHashes()

    // 2. use hashes made during setup to getPermittedOps
    const permittedOps = await this.getPermittedOps()

    // ! temporary to test architecture:
    return permittedOps
    // 3. run upsert logic
    // const ops = permittedOps
    //   .map(({ findObj, setObj }) => (
    //     this.pulseCore
    //       .collection('organizations.treatmentPlans.history')
    //       .updateOne(findObj, setObj, { upsert: true })
    //   ))

    // await Promise.all(ops)

    // return 'success'
  }
}

module.exports = HistoricalProjectData
