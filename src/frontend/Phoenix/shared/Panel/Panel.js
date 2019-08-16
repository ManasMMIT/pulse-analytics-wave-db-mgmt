import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Query } from 'react-apollo'

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
  createButton,
  queryDocs: {
    fetchAllQueryProps,
    fetchSelectedQueryProps,
  },
  panelItemConfig,
}) => {
  return (
    <Wrapper style={style}>
      <PanelHeader
        headerContainerStyle={headerContainerStyle}
        title={title}
        titleStyle={titleStyle}
      >
        {createButton}
      </PanelHeader>


      <Query {...fetchAllQueryProps}>
        {({ data, loading, error }) => {
          if (loading) return null
          if (error) return <div>Error fetching data</div>

          let extractedData = []
          if (data) {
            const firstKey = Object.keys(data)[0]
            extractedData = data[firstKey]
          }

          return (
            <PanelItems
              data={extractedData}
              fetchSelectedQueryProps={fetchSelectedQueryProps}
              panelItemConfig={panelItemConfig}
            />
          )
        }}
      </Query>
    </Wrapper>
  )
}


Panel.propTypes = {
  style: PropTypes.object,
  ...PanelHeader.propTypes,
  createButton: PropTypes.node,
  queryDocs: PropTypes.shape({
    fetchAllQueryProps: PropTypes.object,
    fetchSelectedQueryProps: PropTypes.object,
  }).isRequired,
  panelItemConfig: PanelItems.propTypes.panelItemConfig,
}

Panel.defaultProps = {
  style: {},
  ...PanelHeader.defaultProps,
  createButton: null,
  queryDocs: {
    fetchAllQueryProps: null,
    fetchSelectedQueryProps: null,
  },
  panelItemConfig: PanelItems.defaultProps.panelItemConfig,
}

export default Panel
