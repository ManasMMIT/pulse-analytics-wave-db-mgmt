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
  selectedSheet,
  handleCollectionSelection,
}) => (
  <>
    {
      selectedSheet && (
        <div style={{ marginTop: 24 }}>
          <p>Which collection would you like to upload to?</p>
          <p>Create a blank collection or pick an existing collection to overwrite.</p>
          <Query query={GET_RAW_COLLECTION_NAMES}>
            {({ data: { collections }, loading, error }) => {
              if (error) return <div style={{ color: 'red' }}>Error processing request</div>
              if (loading) return <Spinner />

              return (
                <CreatableSelect
                  onChange={handleCollectionSelection}
                  options={collections.map(n => ({ value: n, label: n }))}
                  value={selectedCollection}
                />
              )
            }}
          </Query>
        </div>
      )
    }
  </>
)

CollectionSelector.propTypes = {
  selectedCollection: PropTypes.object,
  selectedSheet: PropTypes.object,
  handleCollectionSelection: PropTypes.func,
}

export default CollectionSelector
