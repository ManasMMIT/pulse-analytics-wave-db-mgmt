import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import PanelHeader from './PanelHeader'
import PanelItems from './PanelItems'

const Wrapper = styled.div({
  flex: 1,
  minHeight: '100vh',
  maxHeight: '100vh',
  overflowY: 'scroll',
})

const Panel = ({
  style,
  title,
  titleStyle,
  headerContainerStyle,
  headerChildren,
  queryDocs: {
    fetchAllQueryProps,
    fetchSelectedQueryProps,
  },
  panelItemConfig,
}) => {
  const { data, loading, error } = useQuery(fetchAllQueryProps.query)
  if (loading) return null
  if (error) return <div>Error fetching data</div>

  let extractedData = []
  if (data) {
    const firstKey = Object.keys(data)[0]
    extractedData = data[firstKey]
  }

  return (
    <Wrapper style={style}>
      <PanelHeader
        headerContainerStyle={headerContainerStyle}
        title={title}
        titleStyle={titleStyle}
      >
        {headerChildren}
      </PanelHeader>
      <PanelItems
        data={extractedData}
        fetchSelectedQueryProps={fetchSelectedQueryProps}
        panelItemConfig={panelItemConfig}
      />
    </Wrapper>
  )
}


Panel.propTypes = {
  style: PropTypes.object,
  ...PanelHeader.propTypes,
  headerChildren: PropTypes.node,
  queryDocs: PropTypes.shape({
    fetchAllQueryProps: PropTypes.object,
    fetchSelectedQueryProps: PropTypes.object,
  }).isRequired,
  panelItemConfig: PanelItems.propTypes.panelItemConfig,
}

Panel.defaultProps = {
  style: {},
  ...PanelHeader.defaultProps,
  headerChildren: null,
  queryDocs: {
    fetchAllQueryProps: null,
    fetchSelectedQueryProps: null,
  },
  panelItemConfig: PanelItems.defaultProps.panelItemConfig,
}

export default Panel
