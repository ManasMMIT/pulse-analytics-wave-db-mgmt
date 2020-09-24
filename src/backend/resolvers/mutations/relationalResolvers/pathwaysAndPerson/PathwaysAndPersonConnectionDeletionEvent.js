const Event = require('../../shared/Event/Event')
const { DELETE_ACTION } = require('../../shared/Event/actions')

class PathwaysAndPersonConnectionDeletionEvent extends Event {
  constructor(metaData, connection) {
    super(metaData)
    this.action = DELETE_ACTION
    this.entityId = connection.data._id
    this.connectedEntities = connection.connectedEntities

    this.entity = connection
    this.deltas = this.getDeltas()
  }

  process(session) {
    return this.entity.delete(session, this.timestamp)
  }

  getDeltas() {
    return super.getDeltas({
      prev: this.entity.prevData,
      excludedPaths: ['createdOn', 'updatedOn'],
    })
  }
}

module.exports = PathwaysAndPersonConnectionDeletionEvent
