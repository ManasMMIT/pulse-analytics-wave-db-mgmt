const collectionMatchMaker = require('./collectionMatchMaker')
const fieldMatchMaker = require('./fieldMatchMaker')
const conjunctionMatchMaker = require('./conjunctionMatchMaker')
const verbMatchMaker = require('./verbMatchMaker')

/*
  The matching step is meant to add a small amount
    of flexibility to PQL, so that a user doesn't need
    to guess at our collection and field names to get
    meaningful results.
*/

module.exports = {
  collectionMatchMaker,
  fieldMatchMaker,
  conjunctionMatchMaker,
  verbMatchMaker,
}
