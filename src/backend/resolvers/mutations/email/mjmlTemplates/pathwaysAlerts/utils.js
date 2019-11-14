module.exports =  {
  utils: {
    getMonth: month => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const monthInt = typeof month === 'string' ? parseInt(month) : month
      const idx = monthInt - 1

      return months[idx]
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
