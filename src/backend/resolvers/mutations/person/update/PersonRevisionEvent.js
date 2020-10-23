const Event = require('../../shared/Event/Event')
const { UPDATE_ACTION } = require('../../shared/Event/actions')

class PersonRevisionEvent extends Event {
  constructor(metaData, person) {
    super(metaData)
    this.action = UPDATE_ACTION
    this.entityId = person.data._id
    this.businessObject = person.businessObject

    this.entity = person
    this.deltas = this.getDeltas()
  }

  process(session) {
    return this.entity.update(session, this.timestamp)
  }

  getDeltas() {
    return super.getDeltas({
      prev: this.entity.prevData,
      next: this.entity.data,
      excludedPaths: [
        'createdOn',
        'updatedOn',
        'isPathwaysPeople', // exclude special and temporary 'isPathwaysPeople' key
      ],
    })
  }
}

module.exports = PersonRevisionEvent
