const regex = /(\w*) = \(?\w*[,-\w]*\)?/gi

module.exports = pql => pql.match(regex)
