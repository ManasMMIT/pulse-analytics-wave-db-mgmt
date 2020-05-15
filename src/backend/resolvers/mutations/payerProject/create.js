const createPayerProject = async (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info,
) => {
  const { ops } = await pulseCoreDb
    .collection('tdgProjects')
    .insertOne({
      name,
      orgTpIds: [],
      extraOrgTpIds: [],
      createdOn: new Date(),
    })

  return ops[0]
}

module.exports = createPayerProject
