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

// 1. first query GET_STAGED_SITEMAP
// 2. search in query result using sourceEntity.parentId to parentNode
// 3. use parentNode's resources to show the currentNode's resources
// 4. render such that all those resources are toggleable
// 5. trigger callback that writes to React state and apollo at the same time
// 6. modal closes

// const Panel = ({
//   style,
//   title,
//   titleStyle,
//   headerContainerStyle,
//   headerChildren,
//   queryDoc: {}
//   panelItemConfig,
// }) => {
//   const { data, loading, error } = useQuery(fetchAllQueryProps.query)

//   let panelItems
//   if (error) {
//     return <div>Error fetching data</div>
//   } else if (loading) {
//     panelItems = null
//   } else {
//     let extractedData = []
//     if (data) {
//       const firstKey = Object.keys(data)[0]
//       extractedData = data[firstKey]
//     }

//     panelItems = (
//       <PanelItems
//         data={extractedData}
//         fetchSelectedQueryProps={fetchSelectedQueryProps}
//         panelItemConfig={panelItemConfig}
//       />
//     )
//   }

//   return (
//     <Wrapper style={style}>
//       <PanelHeader
//         headerContainerStyle={headerContainerStyle}
//         title={title}
//         titleStyle={titleStyle}
//       >
//         {headerChildren}
//       </PanelHeader>
//       {panelItems}
//     </Wrapper>
//   )
// }


// Panel.propTypes = {
//   style: PropTypes.object,
//   ...PanelHeader.propTypes,
//   headerChildren: PropTypes.node,
//   queryDocs: PropTypes.shape({
//     fetchAllQueryProps: PropTypes.object,
//     fetchSelectedQueryProps: PropTypes.object,
//   }).isRequired,
//   panelItemConfig: PanelItems.propTypes.panelItemConfig,
// }

// Panel.defaultProps = {
//   style: {},
//   ...PanelHeader.defaultProps,
//   headerChildren: null,
//   queryDocs: {
//     fetchAllQueryProps: null,
//     fetchSelectedQueryProps: null,
//   },
//   panelItemConfig: PanelItems.defaultProps.panelItemConfig,
// }

// export default Panel
