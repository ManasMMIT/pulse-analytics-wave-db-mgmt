// ! HARDCODED PATHWAYS ORG SCHEMA FOR DEVELOPMENT
const { ObjectId } = require('mongodb')

const bomSchema = async (parent, { boid }, { pulseCoreDb }) => {
  boid = ObjectId(boid)

  // const pathwaysOrgs = await pulseCoreDb
  //   .collection('organizations')
  //   .find({ type: 'Pathways' })
  //   .toArray()

  // TODO: turn business obj's virtual schema into shape of result
  // const bomSchema = await pulseCoreDb.collection('virtualSchema').find({ _id: boid })

  return [
    {
      tag: 'Info',
      fields: [
        {
          type: 'string',
          label: 'Name',
          key: 'organization',
          oneOf: null,
        },
        {
          type: 'string',
          label: 'Slug',
          key: 'slug',
          oneOf: null,
        },
        {
          type: 'string',
          label: 'Short Name',
          key: 'organizationTiny',
          oneOf: null,
        },
      ]
    },
    {
      tag: 'Program Overview',
      fields: [
        {
          type: 'string',
          label: 'Overview',
          key: 'overview',
          oneOf: null,
        },
        {
          type: 'string',
          label: 'Sponsor',
          key: 'sponsor',
          oneOf: ['Payer', 'Internal', 'Vendor', 'CMS', 'ASCO'],
        },
        {
          type: 'string',
          label: 'Start',
          key: 'start',
          oneOf: null,
        },
        {
          type: 'string',
          label: 'locked b/c enableCrudValidation flag is on and no validation option is selected',
          key: 'ø',
          oneOf: [],
        },
      ]
    },
  ]
}

module.exports = bomSchema
