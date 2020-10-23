const _ = require('lodash')

const Event = require('../../shared/Event/Event')
const { CREATE_ACTION, UPDATE_ACTION } = require('../../shared/Event/actions')

class PathwaysAndPersonConnectionUpsertionEvent extends Event {
  constructor(metaData, connection) {
    super(metaData)
    this.action = _.isEmpty(connection.prevData) ? CREATE_ACTION : UPDATE_ACTION
    this.entityId = connection.data._id
    this.connectedEntities = connection.connectedEntities

    this.entity = connection
    this.deltas = this.getDeltas()
  }

  process(session) {
    if (_.isEmpty(this.entity.prevData)) {
      return this.entity.create(session, this.timestamp)
    } else {
      return this.entity.update(session, this.timestamp)
    }
  }

  getDeltas() {
    return super.getDeltas({
      prev: this.entity.prevData, // will be empty obj if create action
      next: this.entity.data,
      excludedPaths: [
        'createdOn',
        'updatedOn',
        'source', // field not part of the connection form
        'contact', // field not part of the connection form
        'internalRole', // field not part of the connection form
      ],
    })
  }
}

module.exports = PathwaysAndPersonConnectionUpsertionEvent
