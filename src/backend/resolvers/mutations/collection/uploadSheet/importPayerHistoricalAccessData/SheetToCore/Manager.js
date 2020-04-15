const { ObjectId } = require('mongodb')
const _ = require('lodash')

const Validation = require('./Validation')

const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../../../utils/defaultTimeZone')

const {
  ENRICH_TP_PARTS_PIPELINE,
  getProjectOrgTpsPipeline,
} = require('./agg-pipelines')

const {
  getIsQualityAccessSheet,
  getIsAdditionalCriteriaSheet,
  getIsPolicyLinksSheet,
} = require('../utils')

class Manager extends Validation {
  constructor({ projectId, pulseCore }) {
    super()

    this.pulseCore = pulseCore
    this.projectId = ObjectId(projectId)
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
      const orgMatch = this.orgsHashBySlug[datum.slug]

      // if somehow invalid slug gets through, skip sheet data (error instead?)
      // (shouldn't happen once validation is correctly in place)
      if (!orgMatch) return acc

      const organizationId = orgMatch._id

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

        if (!this.allowedOrgTpsHash[orgTpHash]) {
          return // skip the row; once validation layer is in, shouldn't need to do this
        }

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

    const isPolicyLinksSheet = getIsPolicyLinksSheet(this.sheetName)

    const isQualityAccessSheet = getIsQualityAccessSheet(this.sheetName)

    const isAdditionalCriteriaSheet = getIsAdditionalCriteriaSheet(this.sheetName)

    const dataForOps = this.getFilteredAndEnrichedSheetData()

    if (isAdditionalCriteriaSheet) {
      const dataGroupedByOrgTp = _.groupBy(dataForOps, 'orgTpId')

      return Object.keys(dataGroupedByOrgTp)
        .map(orgTpId => {
          const additionalCriteriaDocs = dataGroupedByOrgTp[orgTpId]

          const additionalCriteriaData = additionalCriteriaDocs.length
            ? additionalCriteriaDocs.map(({
              orgTpId, treatmentPlanId, organizationId, ...rest
            }) => rest)
            : null

          return ({
            findObj: {
              orgTpId: ObjectId(orgTpId),
              timestamp: this.timestamp,
            },
            setObject: {
              $set: {
                orgTpId: ObjectId(orgTpId),
                timestamp: this.timestamp,
                additionalCriteriaData,
              }
            }
          })
        })
    }

    return dataForOps.map(datum => {
      const {
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
      } = datum

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
      } else {
        setObj.$set = {}
      }

      return ({
        findObj: {
          orgTpId,
          timestamp: this.timestamp,
        },
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

    // create JS Date Object (which only stores dates in absolute UTC time) as the UTC equivalent of isoShortString in New York time
    this.timestamp = zonedTimeToUtc(timestamp, DEFAULT_TIMEZONE)

    /*
      The policyLink sheet only has a subset of treatmentPlan parts:
        - `coverage`
        - `book`
        - `regimen`

      Therefore, matching orgTpIds requires a different hash of fields to match treatmentPlans.
    */
    const isPolicyLinksSheet = getIsPolicyLinksSheet(sheetName)

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
  }
}

module.exports = Manager
