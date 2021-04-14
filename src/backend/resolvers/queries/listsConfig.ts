const listsConfig = (
    parent,
    { input },
    { pulseDevDb },
    info
  ) => {
    const findObj = input ? { dashboardTool: input.dashboardTool } : {}

    return pulseDevDb
    .collection('listsConfig')
    .find(findObj)
    .sort({
      'dashboardTool': 1,
      'listId': 1,
    })
    .toArray()
  }
  
export default listsConfig
