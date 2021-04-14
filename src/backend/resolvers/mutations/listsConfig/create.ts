const createListsConfig = (
  parent,
  {
    input: {
      listId,
      nodeId,
      listTitle,
      listInfo,
      meta,
      dashboardTool,
    },
  },
  { pulseDevDb },
  info
) => {

  const data = {
    listId,
    nodeId,
    listTitle,
    listInfo,
    meta,
    dashboardTool,
    labelKeys: [],
    createdOn: new Date(),
  }

  return pulseDevDb.collection('listsConfig')
  .insertOne(data)
  .then(({ ops }) => {
    return ops[0]
  })
}

export default createListsConfig
