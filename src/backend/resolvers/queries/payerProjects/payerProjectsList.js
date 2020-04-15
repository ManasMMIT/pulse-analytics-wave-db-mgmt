const payerProjectsList = async (parent, args, { pulseCoreDb }) => {
  const projectList = await pulseCoreDb
    .collection('tdgProjects')
    .find({}, { _id: 1, name: 1 })
    .toArray()

  return projectList
}

module.exports = payerProjectsList
