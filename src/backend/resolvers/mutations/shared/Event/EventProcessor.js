const _ = require('lodash')

class EventProcessor {
  async process({ event, dbs, session }) {
    // if nothing changed, return the entity's prev data without logging
    // and without performing any CRUD action
    if (_.isEmpty(event.deltas)) {
      console.log(`No-op: event wasn't processed because no deltas`)
      return event.entity.prevData
    }

    const [result] = await Promise.all([
      event.process(session),
      this.log({ event, dbs, session }),
    ])

    return result
  }

  async log({ event, dbs, session }) {
    const {
      timestamp,
      userId,
      username,
      action,
      entityId,
      businessObject,
      connectedEntities,
      deltas,
    } = event

    const newEvent = await dbs.pulseCoreDb
      .collection('events')
      .insertOne(
        {
          timestamp,
          userId,
          username,
          action,
          entityId,
          businessObject,
          connectedEntities,
          deltas,
        },
        { session }
      )
      .then((res) => res.ops[0])

    return newEvent
  }
}

module.exports = EventProcessor
