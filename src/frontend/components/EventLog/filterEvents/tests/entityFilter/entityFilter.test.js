import entityFilter from './../../entityFilter'
import allEvents, {
  ENTITY_ID_A,
  ENTITY_ID_C,
  topLevelEntityEvent,
  connectedEntitiesEvent,
  oneSidedDeltaEntityEvent,
} from './simplified-events.mock'

describe('EventLog entityFilter', () => {
  describe('Includes', () => {
    test('all events when filter is empty', () => {
      const result = entityFilter(allEvents, [])

      expect(result).toHaveLength(allEvents.length)
    })

    test('event.entity matches', () => {
      const events = [topLevelEntityEvent]
      const result = entityFilter(events, [ENTITY_ID_A])

      expect(result).toHaveLength(1)
      expect(topLevelEntityEvent.entity._id).toBe(ENTITY_ID_A)
    })

    test('event.connectedEntities matches', () => {
      const events = [connectedEntitiesEvent]
      const result = entityFilter(events, [ENTITY_ID_A])

      const connectedEntityIds = result[0].connectedEntities.map(
        ({ entity }) => entity._id
      )

      expect(result).toHaveLength(1)
      expect(connectedEntityIds).toContain(ENTITY_ID_A)
    })

    test('event.deltas matches', () => {
      const events = [oneSidedDeltaEntityEvent]
      const result = entityFilter(events, [ENTITY_ID_A])

      expect(result).toHaveLength(1)
      expect(result[0].deltas).toEqual(oneSidedDeltaEntityEvent.deltas)
    })

    test('all entity, connectedEntities, deltas matches', () => {
      const result = entityFilter(allEvents, [ENTITY_ID_A])

      expect(result).toHaveLength(allEvents.length)
    })
  })

  describe('Excludes', () => {
    test("events where entity isn't in any of three places", () => {
      const result = entityFilter(allEvents, [ENTITY_ID_C])

      expect(result).toHaveLength(1)
      expect(result).toContainEqual(oneSidedDeltaEntityEvent)
    })
  })
})
