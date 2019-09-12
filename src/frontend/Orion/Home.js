import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <div>
    <div>
      <Link to="/orion/data-management">Data Management</Link>
    </div>
    <div>
      <Link to="/orion/master-lists">Master Lists</Link>
    </div>
  </div>
)

export default Home
