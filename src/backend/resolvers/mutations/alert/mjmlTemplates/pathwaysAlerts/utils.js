module.exports =  {
  utils: {
    getDate: {
      month: () => (new Date()).toLocaleString('default', { month: 'long' }),
      year: () => (new Date()).getFullYear()
    },
    getSlug: data => {
      if (data instanceof Array) return data[0].slug
      return Object.values(data)[0][0].slug
    },
    formatInt: int => parseInt(int).toLocaleString(),
    getSortedLinks: data => {
      const sortOrder = ['positioning', 'influencer', 'provider', 'payer']
      const keys = Object.keys(data)
      return keys.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b))
    },
    relativeAccessColors: {
      'No Pathways': '#BACDDE',
      'No Pathways Coverage': '#BACDDE',
      'Not Reviewed': '#ABB9C7',
      TBD: '#DDE5EB',
      'N/A': '#C9CBCC',
      'No Protocols': '#C9CBCC',
      'Off-Pathways': '#E55257',
      'Off Pathways': '#E55257',
      'Off Pathway': '#E55257',
      OFF: '#E55257',
      'Off-Protocol': '#E55257',
      'Off Protocols': '#E55257',
      Disadvantaged: '#E55257',
      'More Restrictive': '#FD9651',
      'Some Restrictions': '#FD9651',
      Parity: '#0A5595',
      Advantaged: '#2BAC67',
      NT: '#ebf2fa',
      'Not Managed': '#cad8e0'
    }
  },
}
