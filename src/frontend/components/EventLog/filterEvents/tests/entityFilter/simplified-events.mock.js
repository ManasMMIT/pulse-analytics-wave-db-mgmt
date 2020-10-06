export const ENTITY_ID_A = '5eebd6d257b356e357be0d2a'
export const ENTITY_ID_B = '5d825338cc80b15a9476ba8a'
export const ENTITY_ID_C = '5f64cd4fafb0b526154a3c1e'

export const topLevelEntityEvent = {
  username: 'jonathan.lin',
  entity: {
    _id: ENTITY_ID_A,
    firstName: 'Adam',
  },
  connectedEntities: null,
  deltas: [
    {
      field: 'firstName',
      before: 'Atom',
      after: 'Adam',
    },
  ],
}

export const connectedEntitiesEvent = {
  username: 'jonathan.lin',
  entity: null,
  connectedEntities: [
    {
      entity: {
        _id: ENTITY_ID_A,
        firstName: 'Adam',
      },
    },
    {
      entity: {
        _id: ENTITY_ID_B,
        slug: 'via-oncology',
      },
    },
  ],
  deltas: [],
}

export const oneSidedDeltaEntityEvent = {
  username: 'jonathan.lin',
  entity: null,
  connectedEntities: [
    {
      entity: {
        _id: ENTITY_ID_C,
        firstName: 'Adam',
      },
    },
    {
      entity: {
        _id: ENTITY_ID_B,
        slug: 'via-oncology',
      },
    },
  ],
  deltas: [
    {
      field: 'personId',
      before: ENTITY_ID_A,
      after: ENTITY_ID_C,
    },
  ],
}

export default [
  connectedEntitiesEvent,
  topLevelEntityEvent,
  oneSidedDeltaEntityEvent,
]
