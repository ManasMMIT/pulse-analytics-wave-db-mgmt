import React from "react"
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import CreatableSelect from 'react-select/creatable'

import Spinner from '../../../Phoenix/shared/Spinner'

import ImportSelectLabel from './ImportSelectLabel'

import {
  GET_RAW_COLLECTION_NAMES,
} from '../../../api/queries'

const CollectionSelector = ({
  selectedCollection,
  handleCollectionSelection,
}) => {
  const { data, loading, error } = useQuery(GET_RAW_COLLECTION_NAMES)

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner />

  return (
    <div style={{ marginTop: 24 }}>
      <ImportSelectLabel label="Selection Collection:" />
      <CreatableSelect
        onChange={handleCollectionSelection}
        options={data.collections.map(n => ({ value: n, label: n }))}
        value={selectedCollection}
      />
    </div>
  )
}

CollectionSelector.propTypes = {
  selectedCollection: PropTypes.object,
  handleCollectionSelection: PropTypes.func,
}

export default CollectionSelector
