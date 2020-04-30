const QualityAccessManager = require('./QualityAccessManager')
const PolicyLinkManager = require('./PolicyLinkManager')
const AdditionalCriteriaManager = require('./AdditionalCriteriaManager')

class ManagerFactory {
  constructor(projectConfig) {
    this.projectConfig = projectConfig
  }

  getManager(type) {
    switch(type) {
      case 'Quality of Access':
        return new QualityAccessManager(this.projectConfig)
      case 'Policy Links':
        const policyLinkConfig = {
          ...this.projectConfig,
          hashType: 'brcs'
        }
        return new PolicyLinkManager(policyLinkConfig)
      case 'Additional Criteria':
        return new AdditionalCriteriaManager(this.projectConfig)
      default:
        throw new Error('No such type exists')
    }
  }
}

module.exports = ManagerFactory