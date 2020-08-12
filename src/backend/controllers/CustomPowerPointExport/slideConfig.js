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
  caption: {
    fontFace: 'Arial (Body)',
    align: 'center',
    fontSize: 14,
    italic: true,
    bold: true,
    color: '4563A1',
    y: 5.8,
    w: '100%',
  },
  footNote: {
    fontFace: 'Arial',
    fontSize: 8,
    italic: true,
    y: 6.9,
  },
  barChart: {
    y: 1.74,
    x: 0,
    h: 4.1,
    catAxisLabelColor: '00745A',
    catAxisLabelFontBold: true,
    catAxisLabelFontFace: 'Arial',
    catAxisLabelFontSize: 12,
    barDir: 'bar',
    barGrouping: 'stacked',
    chartColors: ['B2DF41', 'FFC60B', 'FF3B3B', 'C00000', 'AEAAAA', 'D9D9D9'],
    showLegend: true,
    legendFontSize: 12,
    legendFontFace: 'Arial',
    w: '100%',
    legendPos: 't',
    showPercent: true,
    showValue: true,
    dataLabelFormatCode: '0%',
    valAxisMaxVal: 1,
    valAxisHidden: true,
    valGridLine: {
      style: 'none',
    },
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
}

const CHART_LABELS = [
  'Nasal Polyps, Adult',
  'Asthma, Eosinophilic',
  'Asthma, Corticosteroid-Dependent',
  'Atopic Dermatitis, Adult',
  'Atopic Dermatitis, Pediatric',
]

const CHART_LABELS_SHORT = [
  'Nasal Polyps',
  'Asthma (Eos)',
  'Asthma (OCS)',
  'Atopic Derm',
  'Pediatric, AD',
]

const defaultChartData = [
  {
    name: 'Favorable / to Label',
    labels: CHART_LABELS,
  },
  {
    name: 'More Restrictive UM',
    labels: CHART_LABELS,
  },
  {
    name: 'Immno / Biologic Step',
    labels: CHART_LABELS,
  },
  {
    name: 'Not Covered',
    labels: CHART_LABELS,
  },
  {
    name: 'Unknown / Undecided',
    labels: CHART_LABELS,
  },
]

const ACCESS_MAP = {
  'PA Required; Criteria Unavailable': 'Favorable / to Label',
  'PA to Label': 'Favorable / to Label',
  'No Formal Policy': 'Favorable / to Label',
  'No PA Required': 'Favorable / to Label',
  'More Restrictive UM': 'More Restrictive UM',
  'Not Reviewed': 'Unknown / Undecided',
  'Not Tracked': 'Unknown / Undecided',
  'Step through BIO': 'Immno / Biologic Step',
  QSE: 'Immno / Biologic Step',
  'Immunosuppressant Step': 'Immno / Biologic Step',
}

const slideText = {
  title: (book) =>
    `~73% ${book} Lives cover Dupixent favorably across all approved indications`,
  caption: 'Caption goes here',
  footNote:
    'Data Sources: Dedham Group Policy Tracking; MMIT Pharmacy Benefit Lives',
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
  chartTitle: (book) =>
    `Dupxient ${book} Quality of Access - Approved Indications`,
  chartSubtitle: ({ accountNum, book }) =>
    `(~100% ${book} Pharmacy Lives; N = ${accountNum} Payers audited)`,
}

module.exports = {
  defaultChartData,
  slideConfig,
  slideText,
  ACCESS_MAP,
  CHART_LABELS,
  CHART_LABELS_SHORT,
}
