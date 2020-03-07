const clientResolvers = require('./client')
const teamResolvers = require('./team')
const userResolvers = require('./user')
const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const organizationResolvers = require('./organization')
const sitemapResolvers = require('./sitemap')
const qualityOfAccessScoreResolvers = require('./qualityOfAccessScore')
const collectionResolvers = require('./collection')
const treatmentPlan = require('./treatmentPlan')
const testEmailGroupResolvers = require('./testEmailGroup')
const workbookResolvers = require('./workbook')

const emailResolvers = require('./email')

const queryResolvers = require('./query')

module.exports = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
  ...qualityOfAccessScoreResolvers,
  ...collectionResolvers,
  ...treatmentPlan,
  ...organizationResolvers,

  ...emailResolvers,
  ...testEmailGroupResolvers,

  ...queryResolvers,

  ...workbookResolvers,

  singleUpload: (parent, args) => {
    debugger 

    return 'blah'
    // return args.file.then(file => {
    //   //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
    //   //file.stream is a node stream that contains the contents of the uploaded file
    //   //node stream api: https://nodejs.org/api/stream.html

    //   debugger

    //   return file
    // })
  }
}
