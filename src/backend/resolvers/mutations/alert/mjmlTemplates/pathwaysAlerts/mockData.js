export default {
  helpers: {
    getDate: {
      month: () => (new Date()).toLocaleString('default', { month: 'long' }),
      year: () => (new Date()).getFullYear()
    },
    getSlug: indicationData => Object.values(indicationData)[0][0].slug,
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
  positioning: {
    'New Century Health': {
      Melanoma: [
        {
          superAlertType: 'Positioning',
          alertDate: '2019-09-11',
          slug: 'new-century-health',
          organization: 'New Century Health',
          regimen: 'Opdivo+Yervoy',
          indication: 'Melanoma',
          population: '',
          position: '1L',
          relativeAccess: 'Some Restrictions',
          alertDescription: 'Relative Access to Label changed to Parity'
        },
        {
          superAlertType: 'Positioning',
          alertDate: '2019-09-11',
          slug: 'new-century-health',
          organization: 'New Century Health',
          regimen: 'Opdivo+Yervoy',
          indication: 'Melanoma',
          population: '',
          position: '1L',
          relativeAccess: 'Some Restrictions',
          alertDescription: 'Relative Access to Label changed to Parity'
        }
      ],
      Gastric: [
        {
          superAlertType: 'Positioning',
          alertDate: '2019-09-06',
          slug: 'new-century-health',
          organization: 'New Century Health',
          regimen: 'Avastin+cisplatin+paclitaxel',
          indication: 'Gastric',
          population: 'HER2+',
          position: '1L',
          relativeAccess: 'No Pathways',
          alertDescription: 'The use of trastuzumab biosimilars is now considered on-pathways'
        }
      ]
    },
    AIM: {
      Melanoma: [
        {
          superAlertType: 'Positioning',
          alertDate: '2019-07-12',
          slug: 'aim',
          organization: 'AIM',
          regimen: 'Zelboraf',
          indication: 'Melanoma',
          population: 'BRAF V600E / V600K',
          position: 'OFF',
          relativeAccess: 'Off-Pathways',
          alertDescription: 'Effective 8/12/2019, Removed from pathways, Braftovi + Mektovi preferred'
        },
        {
          superAlertType: 'Positioning',
          alertDate: '2019-07-12',
          slug: 'aim',
          organization: 'AIM',
          regimen: 'Zelboraf',
          indication: 'Melanoma',
          population: 'BRAF V600E / V600K',
          position: 'OFF',
          relativeAccess: 'Off-Pathways',
          alertDescription: 'Effective 8/12/2019, Removed from pathways, Braftovi + Mektovi preferred'
        }
      ]
    },
    'Via Oncology': {
      'Breast Cancer': [
        {
          superAlertType: 'Positioning',
          alertDate: '2019-08-01',
          slug: 'via-oncology',
          organization: 'Via Oncology',
          regimen: 'Herceptin',
          indication: 'Breast Cancer',
          population: '',
          position: 'Adjuvant & 1L+',
          relativeAccess: 'Parity',
          alertDescription: 'Added as adjuvant option, previously 1L+ option'
        }
      ]
    }
  },
  influencers: {
    AIM: [
      {
        superAlertType: 'Influencer',
        alertDate: '2019-07-12',
        slug: 'aim',
        organization: 'AIM',
        member: 'Antoinette Johnson Wright',
        title: 'Director of Medical Management',
        affiliation: 'AIM',
        indicationCategory: 'General Hematology / Oncology',
        alertDescription: 'Updated position'
      }
    ],
    eviti: [
      {
        superAlertType: 'Influencer',
        alertDate: '2019-07-12',
        slug: 'eviti',
        organization: 'eviti',
        member: 'Bob Petrou',
        title: 'CFO',
        affiliation: 'NantHealth',
        indicationCategory: 'N/A',
        alertDescription: 'Newly identified Executive Leadership Member'
      }
    ],
    'Value Pathways powered by NCCN': [
      {
        superAlertType: 'Influencer',
        alertDate: '2019-07-17',
        slug: 'value-pathways-ncnn',
        organization: 'Value Pathways powered by NCCN',
        member: 'Amanda Fader',
        title: 'Disease Panel Member',
        affiliation: 'Johns Hopkins Medical Institute',
        indicationCategory: 'Cervical',
        alertDescription: 'Newly identified Disease Panel Member'
      }
    ]
  },
  providers: {
    'Via Oncology': [
      {
        superAlertType: 'Provider',
        alertDate: '2019-07-11',
        slug: 'via-oncology',
        organization: 'Via Oncology',
        provider: 'Bon Secours Cancer Institute',
        state: 'VA',
        oncologists: '31',
        alertDescription: 'Newly identifed Via Oncology account'
      }
    ]
  }
}
