const INIT_PERSON_SYMBOL = Symbol('INIT_PERSON_SYMBOL')
const { ObjectId } = require('mongodb')
const PERSON_BUSINESS_OBJECT_ID = ObjectId('5eea22d5adbf920fa4320487')

// factory pattern: https://qwtel.com/posts/software/async-constructor-pattern/#factory-functions
class Person {
  static async init({ data, dbs }) {
    const person = new Person(INIT_PERSON_SYMBOL)

    const businessObject = await dbs.pulseCoreDb
      .collection('businessObjects')
      .findOne({ _id: PERSON_BUSINESS_OBJECT_ID })

    person.businessObject = {
      _id: PERSON_BUSINESS_OBJECT_ID,
      name: businessObject.name,
    }

    person.data = {
      // ! incoming data is splatted in like this because I'm worried
      // ! the class won't be able to keep up with the changing fields on Person
      ...data,
      _id: data._id ? ObjectId(data._id) : ObjectId(),
    }

    person.dbs = dbs

    const prevData = await person.getPrevData()
    person.prevData = prevData || {}

    return person
  }

  constructor(token) {
    if (token !== INIT_PERSON_SYMBOL) {
      throw new Error(
        `Can't initialize Person via constructor; use Person.init instead`
      )
    }
  }

  getPrevData() {
    return this.dbs.pulseCoreDb
      .collection('people')
      .findOne({ _id: this.data._id })
  }

  create(session, timestamp) {
    return this.dbs.pulseCoreDb
      .collection('people')
      .insertOne(
        {
          ...this.data,
          createdOn: timestamp,
          updatedOn: timestamp,
        },
        { session }
      )
      .then(({ ops }) => ops[0])
  }

  async update(session, timestamp) {
    // // Step 1: Update core person
    // const updatedPerson = await this.dbs.pulseCoreDb
    //   .collection('people')
    //   .findOneAndUpdate(
    //     { _id: this.data._id },
    //     {
    //       ...this.data,
    //       updatedOn: timestamp,
    //     },
    //     {
    //       returnOriginal: false,
    //       session,
    //     }
    //   )
    //   .then(({ value }) => value)
    // // Step 2: Cascade update pulse-dev.obmsInfluencers
    // // fill in code from resolver
    // return updatedPerson
  }
}

module.exports = Person
