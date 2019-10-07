import React from 'react'
import ClientsPanel from './ClientsPanel'
import TeamsPanel from './TeamsPanel'
// import UsersPanel from './UsersPanel'
// import StatusPanel from './StatusPanel'

const Home = () => (
  <div style={{ display: "flex" }}>
    <ClientsPanel />
    <TeamsPanel />
    {/* <UsersPanel />
    <StatusPanel /> */}
  </div>
)

export default Home
