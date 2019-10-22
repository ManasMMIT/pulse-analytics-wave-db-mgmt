module.exports =  {
  utils: {
    getDate: {
      month: () => (new Date()).toLocaleString('default', { month: 'long' }),
      year: () => (new Date()).getFullYear()
    },
    getOrgSlugs: data => Object.entries(data).reduce((acc, org) => {
      const [orgName, orgData] = org
      const alerts = Object.values(orgData)[0]
      const slug = alerts instanceof Array ? alerts[0].slug : Object.values(alerts)[0][0].slug
      acc[orgName] = slug
      return acc
    }, {}),
    formatInt: int => parseInt(int).toLocaleString(),
  },
}
