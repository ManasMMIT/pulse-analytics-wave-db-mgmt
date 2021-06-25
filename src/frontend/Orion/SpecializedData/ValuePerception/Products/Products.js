import React from 'react'
import styled from '@emotion/styled'

import Header from 'frontend/components/Header'

import Spacing from 'frontend/utils/spacing'
import FontSpace from 'frontend/utils/fontspace'

import ProductsTable from './ProductsTable'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const TitleSection = styled.section({
  display: 'flex',
  padding: Spacing.S7,
  alignItems: 'center',
})

const Products = () => (
  <Container>
    <TitleSection>
      <Header
        header="Products"
        subheader="Select a table row to view and edit a Product"
        headerStyle={{ ...FontSpace.FS5 }}
      />
    </TitleSection>
    <ProductsTable />
  </Container>
)

export default Products
