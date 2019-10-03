import React from "react"
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import CreatableSelect from 'react-select/creatable'

import Spinner from '../../../Phoenix/shared/Spinner'

import {
  GET_RAW_COLLECTION_NAMES,
} from '../../../api/queries'

const CollectionSelector = ({
  selectedCollection,
  handleCollectionSelection,
}) => (
  <>
    <div style={{ marginTop: 24 }}>
      <p style={{ fontWeight: 700 }}>Select Collection:</p>
      <Query query={GET_RAW_COLLECTION_NAMES}>
        {({ data, loading, error }) => {
          if (error) return <div style={{ color: 'red' }}>Error processing request</div>
          if (loading) return <Spinner />

          return (
            <CreatableSelect
              onChange={handleCollectionSelection}
              options={data.collections.map(n => ({ value: n, label: n }))}
              value={selectedCollection}
            />
          )
        }}
      </Query>
    </div>
  </>
)

CollectionSelector.propTypes = {
  selectedCollection: PropTypes.object,
  handleCollectionSelection: PropTypes.func,
}

export default CollectionSelector
