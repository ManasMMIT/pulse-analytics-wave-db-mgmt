const listsConfig = (
    parent,
    { dashboardTool },
    { pulseDevDb },
    info
  ) => {
    const findObj = {}
    if (dashboardTool) findObj['dashboardTool'] = dashboardTool

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
