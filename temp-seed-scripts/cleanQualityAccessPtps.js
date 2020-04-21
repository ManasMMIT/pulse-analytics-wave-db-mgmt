const DELETE_OP = {
  $or: [
    {
      regimen: { $in: ['Dupixent', 'Cinqair', 'Nucala', 'Fasenra', 'Xolair'] },
      population: 'No Subtype Specified'
    },

    {
      regimen: 'Fasenra', population: 'Eosinophilic'
    },

    {
      indication: 'Urothelial',
      population: {
        $in: [
          'PD-L1 (CPS) Requirement',
          'Cisplatin-Ineligible',
          'PD-L1 (CPS) Requirement, Cisplatin-Ineligible',
          'PD-L1 (IC) Requirement, Cisplatin-Ineligible'
        ]
      }
    },

    {
      indication: 'Melanoma',
      population: { $in: ['BRAF V600', 'Metastatic'] }
    },

    { indication: 'NSCLC', line: '1L+', regimen: 'Keytruda' },

    { indication: 'NSCLC', line: '2L+', regimen: 'Keytruda' },
    // ! requested deletion, below, is covered by op above.
    // { indication: 'NSCLC', population: 'No Subtype Specified', line: '2L+', regimen: 'Keytruda' },
    { indication: 'SCLC', line: '2L+', regimen: 'Keytruda' },

    { indication: 'ALL', line: '3L+' }, // 1 doc
  ]
}

module.exports = pulseCore => pulseCore.collection('payerHistoricalQualityAccess').deleteMany(DELETE_OP)
