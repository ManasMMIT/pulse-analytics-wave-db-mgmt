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
}, props => ({
  ...props.style,
}))

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

  let panelItems
  let extractedData = []
  if (error) {
    return <div>Error fetching data</div>
  } else if (loading) {
    panelItems = null
  } else {
    if (data) {
      const firstKey = Object.keys(data)[0]
      extractedData = data[firstKey]
    }

    panelItems = (
      <PanelItems
        data={extractedData}
        fetchSelectedQueryProps={fetchSelectedQueryProps}
        panelItemConfig={panelItemConfig}
      />
    )
  }

  return (
    <Wrapper style={style}>
      <PanelHeader
        headerContainerStyle={headerContainerStyle}
        title={title}
        titleStyle={titleStyle}
      >
        {
          typeof headerChildren === 'function'
            ? headerChildren(extractedData)
            : headerChildren
        }
      </PanelHeader>
      {panelItems}
    </Wrapper>
  )
}


Panel.propTypes = {
  style: PropTypes.object,
  ...PanelHeader.propTypes,
  headerChildren: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  queryDocs: PropTypes.shape({
    fetchAllQueryProps: PropTypes.object,
    fetchSelectedQueryProps: PropTypes.object,
  }).isRequired,
  panelItemConfig: PanelItems.propTypes.panelItemConfig,
}

Panel.defaultProps = {
  style: {},
  ...PanelHeader.defaultProps,
  queryDocs: {
    fetchAllQueryProps: null,
    fetchSelectedQueryProps: null,
  },
  panelItemConfig: PanelItems.defaultProps.panelItemConfig,
}

export default Panel
