const slideConfig = {
  title: {
    y: 0.5,
    w: '100%',
    fontSize: 22,
    fontFace: 'Arial (Headings)',
    bold: true,
    color: '404040',
    align: 'left',
  },
  footNote: {
    fontFace: 'Arial',
    fontSize: 8,
    italic: true,
    y: 6.9,
  },
  textLegend: { x: 0, y: 6.4, fontSize: 9, w: '100%' },
  chartTitle: {
    y: 1.1,
    w: '100%',
    align: 'center',
    fontSize: 14,
    fontFace: 'Arial',
    bold: true,
  },
  chartSubtitle: {
    y: 1.4,
    w: '100%',
    align: 'center',
    fontSize: 12,
    fontFace: 'Arial',
    italic: true,
  },
  table: {
    w: '98%',
    x: 0.15,
    rowSpan: 0,
    fontSize: 10,
    y: 1.74,
    border: { color: 'CCCCCC' },
    margin: [0, 5, 0, 5],
    colW: [1.5, 0.7, 1.5, 1.5, 1.5, 1.5, 1.5],
  },
}

const slideText = {
  title:
    'Immunosuppressant steps are the most prevalent coverage restriction for patients across all indications at large payers',
  caption: 'Caption goes here',
  footNote: 'Source: Dedham Group Analysis; MMIT Pharmacy Benefit Lives',
  textLegend: [
    { text: '* ' },
    { text: 'Favorable Coverage: ', options: { color: '4C661D' } },
    {
      text:
        'Defined as PA to Label for Asthma & Nasal Polyps, and tropical SSE or DSE for Atopic Dermatitis',
      options: { breakLine: true },
    },
    { text: 'More Restrictive UM: ', options: { color: 'C78207' } },
    {
      text:
        'Defined as “More Restrictive” for Asthma (e.g. 300+ eos, 3+ controllers, 3+ exac) & CRSwNP (e.g. surgery, Xhance), and topical TSE for AD',
      options: { breakLine: true },
    },
    { text: 'Immuno / Bio Step: ', options: { color: 'EA5C30', bold: true } },
    {
      text:
        'Defined as biologic step for Asthma & CRSwNP, and DSE, TSE, or QSE with immunosuppressant for Atopic Dermatitis',
      options: { breakLine: true },
    },
  ],
  tableHeader: [
    {
      text: 'Payer',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: '% Lives',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: 'Eos Asthma',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: 'OCS Asthma',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: '12+ AD',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: 'Pediatric AD',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
    {
      text: 'Nasla Polyps',
      options: {
        color: 'FFFFFF',
        fill: '004D3C',
      },
    },
  ],
  chartTitle: 'Franchise QoA View: Commercial Payers',
  chartSubtitle: '(Top 25 Commercial Plans)',
}

module.exports = {
  slideConfig,
  slideText,
}
