const Event = require('../../shared/Event/Event')
const { DELETE_ACTION } = require('../../shared/Event/actions')

class PersonDeletionEvent extends Event {
  constructor(metaData, person) {
    super(metaData)
    this.action = DELETE_ACTION
    this.entityId = person.data._id
    this.businessObject = person.businessObject

    this.entity = person
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

module.exports = PersonDeletionEvent
