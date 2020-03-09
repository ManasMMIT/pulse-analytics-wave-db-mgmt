// ! HARDCODED PATHWAYS ORG SCHEMA FOR DEVELOPMENT
const { ObjectId } = require('mongodb')

const bomSchema = async (parent, { boId }, { pulseCoreDb }) => {
  boId = ObjectId(boId)

  // const pathwaysOrgs = await pulseCoreDb
  //   .collection('organizations')
  //   .find({ type: 'Pathways' })
  //   .toArray()

  // TODO: turn business obj's virtual schema into shape of result
  // const bomSchema = await pulseCoreDb.collection('virtualSchema').find({ _id: boId })
  const mockReturn = {
    _id: '3255235',
    boId,
    label: 'Pathways Account',
    tags: [
      {
        label: 'Organization Info',
        sections: [
          {
            label: 'info',
            fields: [
              {
                type: 'string',
                label: 'Name',
                key: 'organization',
                oneOf: null,
              },
              {
                type: 'string',
                label: 'Tiny Name',
                key: 'organizationTiny',
                oneOf: null,
              },
              {
                type: 'string',
                label: 'slug',
                key: 'slug',
                oneOf: null,
              },
            ]
          }
        ]
      },
      {
        label: 'Program Overview',
        sections: [
          {
            label: 'Program Overview Details',
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
          }
        ]
      }
    ],
  }

  return mockReturn
}

module.exports = bomSchema
