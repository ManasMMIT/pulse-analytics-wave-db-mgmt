// to form this on the backend, you'll have to deduplicate
// rows when a user has multiple roles

[
  {
    userId: 'admin',
    contentId: 'ae3f',
    resources: {
      treatmentPlans: [
        {
          indication: 'NSCLC',
          regimen: 'Keytruda',
          line: '1L+',
          population: 'No Subtype Specified',
          livesType: 'medicalCommercial',
          book: 'Medical',
          coverage: 'Commercial',
        },
      ]
    }
  },
  {
    userId: 'admin',
    contentId: 'fg78',
    resources: {
      regionalBreakdown: [
        {
          region: 'East',
          states: [
            'NJ',
            'NY'
          ]
        },
        {
          region: 'West',
          states: [
            'CA',
            'WA'
          ]
        }
      ],
      treatmentPlans: [
        {
          indication: 'NSCLC',
          regimen: 'Keytruda',
          line: '1L+',
          population: 'No Subtype Specified',
          livesType: 'medicalCommercial',
          book: 'Medical',
          coverage: 'Commercial',
        },
      ]
    }
  },
]
