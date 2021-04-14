import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { Route, Switch, Redirect } from 'react-router-dom'

import { SELECT_INDICATION } from './../api/mutations'

import ImportExportData from './ImportExportData'
import Organizations from './Organizations'
import GeneralData from './GeneralData'
import Sidebar from './Sidebar'
import SpecializedData from './SpecializedData'
import Administrator from './Administrator'
import Experimental from './Experimental'

const Orion = () => {
  const client = useApolloClient()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (client) {
      client
        .mutate({ mutation: SELECT_INDICATION })
        .then(() => setLoading(false))
    }
  }, [client])

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      {isLoading ? null : (
        <>
          <Sidebar />
          <Switch>
            <Route path="/orion/import-export" component={ImportExportData} />
            <Route path="/orion/organizations" component={Organizations} />
            <Route path="/orion/general" component={GeneralData} />
            <Route path="/orion/specialized" component={SpecializedData} />
            <Route path="/orion/administrator" component={Administrator} />
            <Route path="/orion/experimental" component={Experimental} />
            <Redirect to={'/orion/import-export'} />
          </Switch>
        </>
      )}
    </div>
  )
}

export default Orion
