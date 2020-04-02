const getSheetConfig = async ({ wb, sheet, pulseCoreDb }) => {
  // TODO: If workbook is payer historical data and sheet is qoa, add'l criteria,
  // or policy links, make sure to pick the single source of truth for
  // how payer historical data ought to be validated

  const targetWorkbook = await pulseCoreDb.collection('workbooksConfig')
    .findOne({ name: wb })

  if (!targetWorkbook) throw new Error('No workbook with that name')

  const targetSheetConfig = targetWorkbook.sheets.find(({ name }) => name === sheet)

  if (!targetSheetConfig) throw new Error('No sheet with that name')

  return targetSheetConfig
}

module.exports = getSheetConfig
