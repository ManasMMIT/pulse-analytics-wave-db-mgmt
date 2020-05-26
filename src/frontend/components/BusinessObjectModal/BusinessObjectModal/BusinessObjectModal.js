import React, { useState, useEffect } from 'react'
// import { useMutation } from '@apollo/react-hooks'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
// import _ from 'lodash'
// import gql from 'graphql-tag'

import useBom from '../../../hooks/useBom'

import Color from '../../../utils/color'
import Spacing from '../../../utils/spacing'

import BomSidebar from './BomSidebar'
import BomSections from './BomSections'
import Title from '../../Title'
import Dialog from '../../Dialog'

const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: Spacing.S4,
  borderBottom: `1px solid ${Color.LIGHT_BLUE_GRAY_1}`,
})

const BoContent = styled.div({
  display: 'flex',
  overflowY: 'auto',
  height: '100%',
})

const formatSchemaItems = schema => {
  return schema.tags.map(tag => ({ label: tag.label, value: tag._id }))
}

const BusinessObjectModal = ({ entityId, boId, closeModal, headerText }) => {
  const { schema, entity, loading } = useBom(boId, entityId)

  const [selectedTab, setSelectedTab] = useState({})
  const [inputFields, setInputField] = useState({})

  // 1. Upsertion dynamic mutation
  // 2. Deletion dynamic mutation
  // const [save] = useMutation(SUPER_DYNAMIC_ENDPOINT_EITHER_DELETE_OR_UPSERT, // make a dynamic modal mutation
  //   {
  //     variables: {
  //       input: {
  //         boId,// get to correct collection
  //         entityId, // search to upsert
  //         inputFields // set obj
  //       },
  //     },
  //     update: (cache, { data }) => {
  //       const { __typename, ...newOrUpdatedEntity } = data[Object.keys(data)[0]]

  //       const cacheId = `${__typename}:${newOrUpdatedEntity._id}`

  //       cache.writeFragment({
  //         // id: 'PathwaysOrganization:5d825338cc80b15a9476ba84', // ! example format
  //         id: cacheId,
  //         fragment: gql`
  //           fragment ${ __typename + _.uniqueId() } on ${ __typename } {
  //             ${ Object.keys(newOrUpdatedEntity).join('\n') }
  //             __typename
  //           }
  //         `,
  //         data: {
  //           ...newOrUpdatedEntity,
  //           __typename,
  //         },
  //       });
  //     }
  //     // refetchQueries: [{ query: MAP_QUERY_THINGY[boId] }]
  //   })

  useEffect(() => {
    if (!loading) {
      const firstTab = schema.tags[0]
      const mappedEntitiesToFields = schema.tags.reduce((acc, { sections }) => {
        sections.forEach(({ fields }) => {
          fields.forEach(({ key }) => {
            acc[key] = entity[key] || null
          })
        })
        return acc
      }, {})

      setSelectedTab(firstTab)
      setInputField(mappedEntitiesToFields)
    }
  }, [loading, schema.tags, entity])

  if (loading) return null

  const modalTitle = `Edit ${headerText}`
  const modalTitleModifier = [entity.organization]
  console.log(inputFields)

  return (
    <Dialog>
      <Header>
        <Title title={modalTitle} titleModifiers={modalTitleModifier} />
        <div style={{ margin: Spacing.S4 }}>
          <button onClick={closeModal}>Cancel + Close</button>
          <button onClick={closeModal}>Save + Close</button>
        </div>
      </Header>
      <BoContent>
        <BomSidebar
          options={formatSchemaItems(schema)}
          onClick={({ value }) => {
            const nextTab = schema.tags.find(({ _id }) => _id === value)
            setSelectedTab(nextTab)
          }}
          selectedTab={{ value: selectedTab._id, label: selectedTab.label }}
        />
        <BomSections
          inputFields={inputFields}
          selectedTab={selectedTab}
          setInputField={setInputField}
        />
      </BoContent>
    </Dialog>
  )
}

BusinessObjectModal.propTypes = {
  entityId: PropTypes.string.isRequired,
  boId: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  headerText: PropTypes.string,
}

BusinessObjectModal.defaultProps = {
  closeModal: () => null,
  headerText: '',
}

export default BusinessObjectModal
