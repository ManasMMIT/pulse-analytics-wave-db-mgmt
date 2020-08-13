import React, { useState } from 'react'
import Spinner from 'frontend/components/Spinner'
import FileSaver from 'file-saver'
import Select from 'react-select'

import { useAuth0 } from '../../../react-auth0-spa'
import Color from 'frontend/utils/color'
import { customSelectStyles } from 'frontend/components/customSelectStyles'

import {
  PageHeaderContainer,
  PageHeader,
  ContentContainer,
  SectionContainer,
  SectionHeader,
  StyledButton,
  SelectLabel,
} from './styledComponents'
import Spacing from 'frontend/utils/spacing'

const powerPointUrl = (book) => {
  const encodedBook = encodeURIComponent(book)
  return `/api/custom-powerpoint-export?book=${encodedBook}`
}

const BOOK_OF_BUSINESS = [
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Medicare', value: 'Medicare' },
  { label: 'Managed Medicaid', value: 'Managed Medicaid' },
  { label: 'FFS Medicaid', value: 'FFS Medicaid' },
]

const ExportCustomPowerPoint = () => {
  const { accessToken } = useAuth0()
  const [isLoading, setLoadingStatus] = useState(false)
  const [selectedBook, selectBook] = useState({})

  const clickHandler = (setLoadingStatusFn) => async (e) => {
    e.preventDefault()
    setLoadingStatusFn(true)
    const url = powerPointUrl(selectedBook)

    await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => ({
        blob: await response.blob(),
        filename: response.headers
          .get('Content-Disposition')
          .split('filename=')[1],
      }))
      .then(({ blob, filename }) => {
        FileSaver.saveAs(blob, filename)
      })
      .catch(console.error)

    setLoadingStatusFn(false)
  }

  return (
    <div style={{ flex: '1 0 auto' }}>
      <PageHeaderContainer>
        <PageHeader>Export Custom PowerPoint</PageHeader>
      </PageHeaderContainer>
      <ContentContainer>
        <SectionContainer>
          <SectionHeader>Regeneron/Sanofi PowerPoint Export</SectionHeader>
          <SelectLabel style={{ marginTop: 16 }}>
            Select a Book of Business:
          </SelectLabel>
          <Select
            value={selectedBook.value}
            styles={{ customSelectStyles, marginBottom: 12 }}
            options={BOOK_OF_BUSINESS}
            onChange={({ value }) => selectBook(value)}
          />
          <StyledButton
            size="small"
            onClick={clickHandler(setLoadingStatus)}
            style={{ marginTop: Spacing.S4 }}
          >
            <span style={{ margin: '0 4px 0 6px' }}>Download</span>
            {isLoading && <Spinner fill={Color.PRIMARY} />}
          </StyledButton>
        </SectionContainer>
      </ContentContainer>
    </div>
  )
}

export default ExportCustomPowerPoint
