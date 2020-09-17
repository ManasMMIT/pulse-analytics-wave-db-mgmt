const Event = require('../../shared/Event/Event')
const { CREATE_ACTION } = require('../../shared/Event/actions')

class PersonCreationEvent extends Event {
  constructor(metaData, person) {
    super(metaData)
    this.action = CREATE_ACTION
    this.entityId = person.data._id
    this.businessObject = person.businessObject

    this.entity = person
    this.deltas = this.getDeltas()
  }

  process(session) {
    return this.entity.create(session, this.timestamp)
  }

  getDeltas() {
    return super.getDeltas({
      next: this.entity.data,
      excludedPaths: ['createdOn', 'updatedOn'],
    })
  }
}

module.exports = PersonCreationEvent
