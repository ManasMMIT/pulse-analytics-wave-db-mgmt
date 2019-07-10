module.exports = {
  clients: {
    find:() => {}, // both find one and find all
    create:() => {},
    update:() => {},
    delete:() => {},
  },
  roles: {
    find:() => {}, // both find one and find all
    create:() => {},
    update:() => {},
    delete:() => {},
  },
  users: {
    find:() => {}, // both find one and find all
    create:() => {},
    update:() => {},
    delete:() => {},
  },
}

// app.get('/api', async (req, res) => {
  // const name = "Test Client-test!"
  // await authClient.updateRole({
  //   id: '597a114b-70d7-4899-9c3b-458c3999edfe',
  //   name: name,
  //   description: 'testtesttest',
  //   permissions: [],
  // })

  // await authClient.updateGroup({
  //   groupId: '77fa8873-e8cf-46ad-96ff-39667aaedd9c',
  //   name,
  //   description: 'testest',
  // })
// })

