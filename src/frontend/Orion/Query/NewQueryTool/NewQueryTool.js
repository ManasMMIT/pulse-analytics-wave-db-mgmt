import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { Switch, Route, Redirect } from 'react-router-dom'
import queryString from 'query-string'

import FontSpace from '../../../utils/fontspace'
import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import PlacardView from './PlacardView'
import PqlView from './PqlView'

const Wrapper = styled.div({
  width: '100%',
  padding: Spacing.S4,
  background: Color.LIGHT_BLUE_GRAY_1,
})

const ViewButton = styled(Link)({
  fontWeight: 700,
  padding: 12,
  background: 'blue',
  color: 'white',
  borderRadius: 4,
})

const NewQueryTool = () => {
  const { pathname, search } = useLocation()

  const isPlacardView = pathname.includes('placard')

  const viewButtonLink = isPlacardView
    ? '/orion/query/tool/pql'
    : '/orion/query/tool/placard'

  const viewButtonLabel = isPlacardView
    ? 'PQL View'
    : 'Back'

  const { pql } = queryString.parse(search)

  let searchValue = search
  if (pql && !isPlacardView) {
    const businessObjectName = pql.match(/[\w\s]+={.*}/) && pql.match(/[\w\s]+=/)[0].replace('=', '')
    searchValue = queryString.stringify({ pql: businessObjectName ? `${businessObjectName}={}` : null })
  }

  return (
    <Wrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ padding: Spacing.S4, ...FontSpace.FS4 }}>Query Tool</h1>
        <ViewButton to={{
          pathname: viewButtonLink,
          search: searchValue,
        }}>
          {viewButtonLabel}
        </ViewButton>
      </div>
      <Switch>
        <Route path={"/orion/query/tool/placard"} component={PlacardView} />
        <Route path={"/orion/query/tool/pql"} component={PqlView} />
        <Redirect to={"/orion/query/tool/placard"} />
      </Switch>
    </Wrapper>
  )
}
export default NewQueryTool
