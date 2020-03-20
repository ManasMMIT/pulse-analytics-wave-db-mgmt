const { ObjectId } = require('mongodb')
const _ = require('lodash')

const {
  ENRICH_TP_PARTS_PIPELINE,
  getProjectOrgTpsPipeline,
  getProjectOrgTpsEnrichedPipeline,
} = require('./agg-pipelines')

class ProjectHistoryManager {
  constructor({ projectId, pulseCore }) {
    this.projectId = ObjectId(projectId)
    this.pulseCore = pulseCore
  }

  async validate({
    sheetData,
    sheetName,
  }) {
    const allowedOrgTpCombos = await this.pulseCore
      .collection('tdgProjects')
      .aggregate(
        getProjectOrgTpsEnrichedPipeline(this.projectId)
      )
      .toArray()

    const isPolicyLinksSheet = /PolicyLinks/.test(sheetName)

    const selectedTpHasher = isPolicyLinksSheet
      ? this.POLICY_LINKS_hashTpParts
      : this.hashTpParts

    const allowedOrgTpHashByParts = _.keyBy(
      allowedOrgTpCombos,
      combo => [
        combo.slug,
        selectedTpHasher(combo)
      ].join('|'),
    )

    const exactCorrectSetOfOrgTps = Object.keys(allowedOrgTpHashByParts)

    const sheetDataHashes = sheetData.map(datum => {
      const datumOrgTpHash = [
        datum.slug,
        selectedTpHasher(datum)
      ].join('|')

      return datumOrgTpHash
    })
    
    const missingOrgTpCombos = _.difference(
      exactCorrectSetOfOrgTps,
      sheetDataHashes,
    ).join('\n')

    const invalidOrgTpCombos = _.difference(
      sheetDataHashes,
      exactCorrectSetOfOrgTps,
    ).join('\n')

    if (missingOrgTpCombos.length || invalidOrgTpCombos.length) {
      throw new Error(
        'Incoming organization-treatmentPlan combos did not pass validation\n'
        + `The following combinations were expected, but missing:\n${missingOrgTpCombos}\n`
        + `The following combinations were invalid:\n${invalidOrgTpCombos}\n`
      )
    }

    // ! Still possible at this point that all orgTps in sheetDataHashes are valid but
    // ! there are dupes in them, which requires us to error
    if (sheetDataHashes.length !== exactCorrectSetOfOrgTps.length) {
      const hash = {}
      const orgTpsThatHaveDupes = []

      for (const str of sheetDataHashes) {
        if (hash[str]) {
          hash[str]++
        } else {
          hash[str] = 1
        }

        if (hash[str] === 2) orgTpsThatHaveDupes.push(str)
      }

      throw new Error(
        'Incoming organization-treatmentPlan combos did not pass validation\n'
        + `The following combinations were duplicated: ${orgTpsThatHaveDupes}\n`
      )
    }
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

  async upsertOrgTpHistory({
    sheetData,
    sheetName,
    timestamp,
  }) {
    this.sheetName = sheetName
    this.sheetData = sheetData
    this.timestamp = new Date(timestamp)
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

module.exports = ProjectHistoryManager
