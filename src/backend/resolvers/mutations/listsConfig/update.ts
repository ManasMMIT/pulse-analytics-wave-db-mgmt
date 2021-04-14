const { ObjectId } = require('mongodb')

const updateListsConfig = async (
  parent,
  { input: { 
      _id,
      listId,
      nodeId,
      listTitle,
      listInfo,
      meta,
      dashboardTool,
      labelKeys,
   } 
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
        labelKeys,
    },
    newData = {}

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            newData[key] = value
        }
    }
    
    return pulseDevDb.collection('listsConfig')
    .findOneAndUpdate(
        { _id: ObjectId(_id) },
        {
            $set: newData,
        },
        { returnOriginal: false }
    )
    .then(({ value }) => value)
}  

export default updateListsConfig
