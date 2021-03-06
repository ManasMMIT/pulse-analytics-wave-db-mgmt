const Event = require('../Event')

describe(`getDeltas util on base Event class works as expected`, () => {
  const event = new Event({}, {})

  test.todo(
    'Test correct fieldMetaData insertion for basic and relational events'
  )

  test('Correctly diffs CREATE for 1D objects', () => {
    const deltas = event.getDeltas({
      prev: {},
      next: { a: 123, b: 'hello', c: 5.5 },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: null,
        after: 123,
      },
      {
        field: 'b',
        before: null,
        after: 'hello',
      },
      {
        field: 'c',
        before: null,
        after: 5.5,
      },
    ])
  })

  test('Correctly diffs DELETE for 1D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: {},
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: null,
      },
      {
        field: 'b',
        before: 'hello',
        after: null,
      },
      {
        field: 'c',
        before: 5.5,
        after: null,
      },
    ])
  })

  test(`Correctly no-ops for 1D objects when field values haven't changed`, () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 123, b: 'hello', c: 5.5 },
    })

    expect(deltas).toStrictEqual([])
  })

  test(`Correctly diffs a mix of no-ops, created, updated, and deleted fields on 1D objects`, () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 123, b: 'world', d: 12.2 },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'b',
        before: 'hello',
        after: 'world',
      },
      {
        field: 'c',
        before: 5.5,
        after: null,
      },
      {
        field: 'd',
        before: null,
        after: 12.2,
      },
    ])
  })

  test('Correctly diffs CLEAN UPDATE for 1D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 456, b: 'testing', c: 3.5 },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: 456,
      },
      {
        field: 'b',
        before: 'hello',
        after: 'testing',
      },
      {
        field: 'c',
        before: 5.5,
        after: 3.5,
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 1D objects (extra fields in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 456, b: 'testing', c: 3.5, d: 'new random field' },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: 456,
      },
      {
        field: 'b',
        before: 'hello',
        after: 'testing',
      },
      {
        field: 'c',
        before: 5.5,
        after: 3.5,
      },
      {
        field: 'd',
        before: null,
        after: 'new random field',
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 1D objects (missing fields in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 456, b: 'testing' },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: 456,
      },
      {
        field: 'b',
        before: 'hello',
        after: 'testing',
      },
      {
        field: 'c',
        before: 5.5,
        after: null,
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 1D objects (some fields missing, some fields extra in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, b: 'hello', c: 5.5 },
      next: { a: 456, b: 'testing', d: 'new random field' },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: 456,
      },
      {
        field: 'b',
        before: 'hello',
        after: 'testing',
      },
      {
        field: 'c',
        before: 5.5,
        after: null,
      },
      {
        field: 'd',
        before: null,
        after: 'new random field',
      },
    ])
  })

  test('Correctly ignores excludedPaths while diffing 1D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: 123, e: 'hi', b: 'hello', c: 5.5 },
      next: { a: 456, e: 'hi', b: 'testing', d: 'new random field' },
      excludedPaths: ['b', 'c', 'd'],
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a',
        before: 123,
        after: 456,
      },
    ])
  })

  test('Correctly diffs CREATE for 2D objects', () => {
    const deltas = event.getDeltas({
      prev: {},
      next: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: null,
        after: 123,
      },
      {
        field: 'b.newKey',
        before: null,
        after: 'hello',
      },
      {
        field: 'c.deep.nested',
        before: null,
        after: 5.5,
      },
    ])
  })

  test('Correctly diffs DELETE for 2D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: {},
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: 123,
        after: null,
      },
      {
        field: 'b.newKey',
        before: 'hello',
        after: null,
      },
      {
        field: 'c.deep.nested',
        before: 5.5,
        after: null,
      },
    ])
  })

  test(`Correctly no-ops for 2D objects when field values haven't changed`, () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
    })

    expect(deltas).toStrictEqual([])
  })

  test('Correctly diffs CLEAN UPDATE for 2D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: { a: [456], b: { newKey: 'world' }, c: { deep: { nested: 3.4 } } },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: 123,
        after: 456,
      },
      {
        field: 'b.newKey',
        before: 'hello',
        after: 'world',
      },
      {
        field: 'c.deep.nested',
        before: 5.5,
        after: 3.4,
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 2D objects (extra fields in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: {
        a: [456],
        b: { newKey: 'world' },
        c: { deep: { nested: 3.4 } },
        d: { here: ['nest'] },
      },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: 123,
        after: 456,
      },
      {
        field: 'b.newKey',
        before: 'hello',
        after: 'world',
      },
      {
        field: 'c.deep.nested',
        before: 5.5,
        after: 3.4,
      },
      {
        field: 'd.here.0',
        before: null,
        after: 'nest',
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 2D objects (missing fields in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: { a: [456], b: { newKey: 'world' } },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: 123,
        after: 456,
      },
      {
        field: 'b.newKey',
        before: 'hello',
        after: 'world',
      },
      {
        field: 'c.deep.nested',
        before: 5.5,
        after: null,
      },
    ])
  })

  test('Correctly diffs DIRTY UPDATE for 2D objects (some fields missing, some fields extra in incoming)', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: { a: [456], b: { newKey: 'world' }, d: { here: ['nest'] } },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.0',
        before: 123,
        after: 456,
      },
      {
        field: 'b.newKey',
        before: 'hello',
        after: 'world',
      },
      {
        field: 'c.deep.nested',
        before: 5.5,
        after: null,
      },
      {
        field: 'd.here.0',
        before: null,
        after: 'nest',
      },
    ])
  })

  test('Correctly ignores excludedPaths while diffing 2D objects', () => {
    const deltas = event.getDeltas({
      prev: { a: [123], b: { newKey: 'hello' }, c: { deep: { nested: 5.5 } } },
      next: { a: [456], b: { newKey: 'world' }, d: { here: ['nest'] } },
      excludedPaths: ['a.0', 'b.newKey', 'c.deep.nested'],
    })

    expect(deltas).toStrictEqual([
      {
        field: 'd.here.0',
        before: null,
        after: 'nest',
      },
    ])
  })

  test('Correctly diffs CREATE for 7D object', () => {
    const deltas = event.getDeltas({
      prev: {},
      next: { a: { b: { c: { d: { e: { f: ['el1', 'el2', 'el3'] } } } } } },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.b.c.d.e.f.0',
        before: null,
        after: 'el1',
      },
      {
        field: 'a.b.c.d.e.f.1',
        before: null,
        after: 'el2',
      },
      {
        field: 'a.b.c.d.e.f.2',
        before: null,
        after: 'el3',
      },
    ])
  })

  test('Correctly diffs DELETE for 7D object', () => {
    const deltas = event.getDeltas({
      prev: { a: { b: { c: { d: { e: { f: ['el1', 'el2', 'el3'] } } } } } },
      next: {},
    })

    expect(deltas).toStrictEqual([
      {
        field: 'a.b.c.d.e.f.0',
        before: 'el1',
        after: null,
      },
      {
        field: 'a.b.c.d.e.f.1',
        before: 'el2',
        after: null,
      },
      {
        field: 'a.b.c.d.e.f.2',
        before: 'el3',
        after: null,
      },
    ])
  })

  test(`Correctly no-ops for 7D objects when field values haven't changed`, () => {
    const deltas = event.getDeltas({
      prev: { a: { b: { c: { d: { e: { f: ['el1', 'el2', 'el3'] } } } } } },
      next: { a: { b: { c: { d: { e: { f: ['el1', 'el2', 'el3'] } } } } } },
    })

    expect(deltas).toStrictEqual([])
  })

  test('Correctly diffs DIRTY UPDATE for 7D object (mixed nesting)', () => {
    const deltas = event.getDeltas({
      prev: {
        crazy: { hi: 'fruit' },
        a: { b: { c: { d: { e: { f: ['el1', 'el2', 'el3'] } } } } },
      },
      next: { a: { b: { c: ['hello'] } }, testing: 'world' },
    })

    expect(deltas).toStrictEqual([
      {
        field: 'crazy.hi',
        before: 'fruit',
        after: null,
      },
      {
        field: 'a.b.c.d.e.f.0',
        before: 'el1',
        after: null,
      },
      {
        field: 'a.b.c.d.e.f.1',
        before: 'el2',
        after: null,
      },
      {
        field: 'a.b.c.d.e.f.2',
        before: 'el3',
        after: null,
      },
      {
        field: 'a.b.c.0',
        before: null,
        after: 'hello',
      },
      {
        field: 'testing',
        before: null,
        after: 'world',
      },
    ])
  })

  describe('Correctly special cases for array value deltas', () => {
    test('completely equal array generates no delta', () => {
      const deltas = event.getDeltas({
        prev: { a: [1, 2, 3] },
        next: { a: [1, 2, 3] },
      })

      expect(deltas).toStrictEqual([])
    })

    test('re-ordered array generates delta with before/after arrays completely preserved', () => {
      const deltas = event.getDeltas({
        prev: { a: [1, 2, 3] },
        next: { a: [1, 3, 2] },
      })

      expect(deltas).toStrictEqual([
        {
          field: 'a.0',
          before: 1,
          after: 1,
        },
        {
          field: 'a.1',
          before: 2,
          after: 3,
        },
        {
          field: 'a.2',
          before: 3,
          after: 2,
        },
      ])
    })

    test('superset array generates delta with before/after arrays completely preserved', () => {
      const deltas = event.getDeltas({
        prev: { a: [1, 2, 3] },
        next: { a: [1, 2, 3, 4, 5] },
      })

      expect(deltas).toStrictEqual([
        {
          field: 'a.0',
          before: 1,
          after: 1,
        },
        {
          field: 'a.1',
          before: 2,
          after: 2,
        },
        {
          field: 'a.2',
          before: 3,
          after: 3,
        },
        {
          field: 'a.3',
          before: null,
          after: 4,
        },
        {
          field: 'a.4',
          before: null,
          after: 5,
        },
      ])
    })
    test('subset array generates delta with before/after arrays completely preserved', () => {
      const deltas = event.getDeltas({
        prev: { a: [1, 2, 3, 4] },
        next: { a: [1, 2] },
      })

      expect(deltas).toStrictEqual([
        {
          field: 'a.0',
          before: 1,
          after: 1,
        },
        {
          field: 'a.1',
          before: 2,
          after: 2,
        },
        {
          field: 'a.2',
          before: 3,
          after: null,
        },
        {
          field: 'a.3',
          before: 4,
          after: null,
        },
      ])
    })

    test('generates deltas for unequal nested arrays', () => {
      const deltas = event.getDeltas({
        prev: { a: { cat: [1, 2, 3, 4] } },
        next: { a: { cat: [1, 2, 3, 4, 5] } },
      })

      expect(deltas).toStrictEqual([
        {
          field: 'a.cat.0',
          before: 1,
          after: 1,
        },
        {
          field: 'a.cat.1',
          before: 2,
          after: 2,
        },
        {
          field: 'a.cat.2',
          before: 3,
          after: 3,
        },
        {
          field: 'a.cat.3',
          before: 4,
          after: 4,
        },
        {
          field: 'a.cat.4',
          before: null,
          after: 5,
        },
      ])
    })
  })
})
