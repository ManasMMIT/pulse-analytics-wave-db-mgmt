// TODO: Deprecate old Phoenix Treatment Plans Panel; this resolver is bad

const { ObjectId } = require('mongodb')
const getIndTherapeuticAreaPipeline = require('./getIndTherapeuticAreaPipeline')

const updateSourceIndication = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  // ! if updating is coming from the indications panel, regimens won't be present at all
  // ! and that slice of the indication doc must remain untouched, so don't add that key to body;
  // ! otherwise, updating is coming from Phoenix Treatment Plans panel, and we need to
  // ! perform the following logic
  if (body.regimens) {
    const editedRegimens = body.regimens.map(
      ({ _id: regimenId, name, products }) => {
        const newRegimenId = ObjectId(regimenId)

        const editedProducts = products.map(
          ({ _id: productId, ...product }) => {
            const newProductId = ObjectId(productId)
            return { _id: newProductId, ...product }
          }
        )

        return {
          _id: newRegimenId,
          name,
          products: editedProducts,
        }
      }
    )

    body.regimens = editedRegimens
  }

  // ! if 'therapeuticAreaId' key exists in incoming body, that means update op
  // ! is coming from indications panel, and we should throw an error if the user
  // ! hasn't selected a corresponding therapeutic area;
  // ! otherwise, the update is coming from the phoenix treatment plans (ind+reg)
  // ! panel and that panel has no bearing on the 'therapeuticAreaId' slice, so
  // ! we leave 'therapeuticAreaId' out of what gets $set in the update op
  if ('therapeuticAreaId' in body) {
    if (!body.therapeuticAreaId) {
      throw new Error(`Therapeutic area must be selected for the indication`)
    } else {
      body.therapeuticAreaId = ObjectId(body.therapeuticAreaId)
    }
  }

  const session = mongoClient.startSession()

  let updatedIndication
  await session.withTransaction(async () => {
    // Step 1: Update the indication
    updatedIndication = await pulseCoreDb
      .collection('indications')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update the indication's name in pulse-dev.users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources').updateMany(
      { 'resources.treatmentPlans._id': _id },
      {
        $set: {
          'resources.$[resource].treatmentPlans.$[indication].name':
            updatedIndication.name,
        },
      },
      {
        arrayFilters: [
          { 'resource.treatmentPlans': { $exists: true } },
          { 'indication._id': _id },
        ],
        session,
      }
    )

    // Step 3: Materialize the updated indication/therapeuticArea combo doc and update
    // corresponding doc in pulse-dev.indicationsTherapeuticAreas collection
    const docToUpdate = await pulseCoreDb
      .collection('indications')
      .aggregate(getIndTherapeuticAreaPipeline(_id), { session })
      .next()

    await pulseDevDb
      .collection('indicationsTherapeuticAreas')
      .updateOne({ _id }, { $set: docToUpdate }, { session, upsert: true })

    // Step 4: Update the materialized pathwaysInfluencers
    // collection in pulse-dev

    // we first need to find what the indication used to be, before it was updated
    // by making a query outside of the running transaction
    const { name: indicationNameBeforeUpdate } = await pulseCoreDb
      .collection('indications')
      .findOne({ _id })

    // with the old name known, we can now update every instance of the old name to
    // the new name in the `indication` array in pathwaysInfluencers
    await pulseDevDb.collection('pathwaysInfluencers').updateMany(
      { indication: indicationNameBeforeUpdate },
      {
        $set: {
          'indication.$[indName]': updatedIndication.name,
          updatedOn: new Date(),
        },
      },
      {
        arrayFilters: [{ indName: indicationNameBeforeUpdate }],
        session,
      }
    )
  })

  return updatedIndication
}

module.exports = updateSourceIndication
