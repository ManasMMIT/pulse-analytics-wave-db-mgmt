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
    _id: ObjectId('5e6a79786d683aa2f5285c3d'),
    boId,
    label: 'Pathways',
    tags: [
      {
        _id: ObjectId('5e6a79786d683aa2f5285c3c'),
        label: 'Organization Info',
        sections: [
          {
            _id: ObjectId('5e6a79786d683aa2f5285c0c'),
            label: 'Basic Info',
            fields: [
              {
                _id: ObjectId('5e6a79786d683aa2f5285c0d'),
                label: 'Name',
                key: 'organization',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c0e'),
                label: 'Tiny Name',
                key: 'organizationTiny',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c0f'),
                label: 'slug',
                key: 'slug',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
            ],
          },
          {
            _id: ObjectId('5e6a79786d683aa2f5285c21'),
            label: 'Program Overview Details (Duped Subset of Another Section)',
            fields: [
              {
                _id: ObjectId('5e6a79786d683aa2f5285c22'),
                label: 'Overview',
                key: 'overview',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6aa52dd63990a3f692a187'),
                label:
                  'Duped Overview Field (should update in line with field above)',
                key: 'overview',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c23'),
                label: 'Sponsor',
                key: 'sponsor',
                inputComponent: 'Select',
                inputProps: {
                  type: 'string',
                  options: [
                    { label: 'Payer', value: 'Payer' },
                    { label: 'Internal', value: 'Internal' },
                    { label: 'Vendor', value: 'Vendor' },
                    { label: 'CMS', value: 'CMS' },
                    { label: 'ASCO', value: 'ASCO' },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c24'),
                label: 'Start',
                key: 'start',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
            ],
          },
        ],
      },
      {
        _id: ObjectId('5e6a79786d683aa2f5285c10'),
        label: 'Program Overview',
        sections: [
          {
            _id: ObjectId('5e6a79786d683aa2f5285c11'),
            label: 'Program Overview Details',
            fields: [
              {
                _id: ObjectId('5e6a79786d683aa2f5285c12'),
                label: 'Overview',
                key: 'overview',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c13'),
                label: 'Sponsor',
                key: 'sponsor',
                inputComponent: 'Select',
                inputProps: {
                  type: 'string',
                  options: [
                    { label: 'Payer', value: 'Payer' },
                    { label: 'Internal', value: 'Internal' },
                    { label: 'Vendor', value: 'Vendor' },
                    { label: 'CMS', value: 'CMS' },
                    { label: 'ASCO', value: 'ASCO' },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c14'),
                label: 'Start',
                key: 'start',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c15'),
                label: 'End',
                key: 'end',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c3a'),
                label: 'Focus',
                key: 'focus',
                inputComponent: 'TextInput',
                inputProps: {
                  type: 'string',
                  options: null,
                },
              },
            ],
          },
          {
            _id: ObjectId('5e6a79786d683aa2f5285c28'),
            label: 'Lives Eligibility',
            fields: [
              {
                _id: ObjectId('5e6a79786d683aa2f5285c29'),
                label: 'Commercial',
                key: 'commercial',
                inputComponent: 'Select',
                inputProps: {
                  type: 'number',
                  options: [
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c2a'),
                label: 'Medicaid',
                key: 'medicaid',
                inputComponent: 'Select',
                inputProps: {
                  type: 'number',
                  options: [
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c2b'),
                label: 'Medicare',
                key: 'medicare',
                inputComponent: 'Select',
                inputProps: {
                  type: 'number',
                  options: [
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c2c'),
                label: 'Exchange',
                key: 'exchange',
                inputComponent: 'Select',
                inputProps: {
                  type: 'number',
                  options: [
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        _id: ObjectId('5e6a79786d683aa2f5285c25'),
        label: 'Fake Tab With Extra Info',
        sections: [
          {
            _id: ObjectId('5e6a79786d683aa2f5285c1a'),
            label: 'Fake Extra Info 1',
            fields: [
              {
                _id: ObjectId('5e6a79786d683aa2f5285c1b'),
                label: 'Fake Date Custom Field',
                key: 'fakeDateField1',
                inputComponent: 'DateInput',
                inputProps: {
                  type: 'date',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6aa28ebcb3a28e588cf995'),
                label: 'Fake Date Select Field',
                key: 'fakeDateField2',
                inputComponent: 'Select',
                inputProps: {
                  type: 'date',
                  options: [
                    {
                      label: new Date(2018, 0, 3),
                      value: new Date(2018, 0, 3),
                    },
                    {
                      label: new Date(2018, 2, 3),
                      value: new Date(2018, 2, 3),
                    },
                    {
                      label: new Date(2019, 5, 3),
                      value: new Date(2019, 5, 3),
                    },
                    {
                      label: new Date(2020, 2, 20),
                      value: new Date(2020, 2, 20),
                    },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c1c'),
                label: 'Fake Number Select Field With Multi',
                key: 'fakeNumberField1',
                inputComponent: 'Select',
                inputProps: {
                  type: 'number',
                  isMulti: true,
                  options: [
                    { label: 0, value: 0 },
                    { label: 1, value: 1 },
                    { label: 2, value: 2 },
                    { label: 3, value: 3 },
                    { label: 4, value: 4 },
                  ],
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c1d'),
                label: 'Fake Email Select Field',
                key: 'fakeEmailField1',
                inputComponent: 'Select',
                inputProps: {
                  type: 'email',
                  options: [
                    { label: 'asdf@asdf.com', value: 'asdf@asdf.com' },
                    { label: 'hello@hello.com', value: 'hello@hello.com' },
                    { label: 'test@test.com', value: 'test@test.com' },
                  ],
                },
              },
            ],
          },
          {
            _id: ObjectId('5e6a79786d683aa2f5285c26'),
            label: 'Fake Extra Info 2',
            fields: [
              {
                _id: ObjectId('5e6aa30cbcb3a28e588cf996'),
                label: 'Fake Email Custom Field',
                key: 'fakeEmailField2',
                inputComponent: 'EmailInput',
                inputProps: {
                  type: 'email',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c1e'),
                label: 'Fake Range Field',
                key: 'fakeRangeField1',
                inputComponent: 'RangeInput',
                inputProps: {
                  type: 'range',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c1f'),
                label: 'Fake Time Field',
                key: 'fakeTimeField1',
                inputComponent: 'TimeInput',
                inputProps: {
                  type: 'time',
                  options: null,
                },
              },
            ],
          },
          {
            _id: ObjectId('5e6a79786d683aa2f5285c27'),
            label: 'Fake Extra Info 3',
            fields: [
              {
                _id: ObjectId('5e6aa342bcb3a28e588cf997'),
                label: 'Fake Number Custom Field',
                key: 'fakeNumberField2',
                inputComponent: 'NumberInput',
                inputProps: {
                  type: 'number',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c20'),
                label: 'Fake Checkbox Field',
                key: 'fakeCheckboxField1',
                inputComponent: 'CheckboxInput',
                inputProps: {
                  type: 'checkbox',
                  options: null,
                },
              },
              {
                _id: ObjectId('5e6a79786d683aa2f5285c3b'),
                label:
                  'Locked String Field (cuz options is empty array instead of null)',
                key: 'fakeLockedField',
                inputComponent: 'Select',
                inputProps: {
                  type: 'string',
                  options: [],
                },
              },
              {
                _id: ObjectId('5e6aa849f729f0e2eda71b02'),
                label: 'String Field With Multi',
                key: 'fakeStringField1',
                inputComponent: 'Select',
                inputProps: {
                  type: 'string',
                  isMulti: true,
                  options: [
                    { label: 'hello', value: 'hello' },
                    { label: 'world', value: 'world' },
                    { label: 'javascript', value: 'javascript' },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  }

  return mockReturn
}

module.exports = bomSchema
