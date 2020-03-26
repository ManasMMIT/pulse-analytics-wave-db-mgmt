import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import { transparentize } from 'polished'
import Spinner from '../../../Phoenix/shared/Spinner'
import { useAuth0 } from '../../../../react-auth0-spa'
import FileSaver from 'file-saver'

import Color from '../../../utils/color'
import FontSpace from '../../../utils/fontspace'
import Spacing from '../../../utils/spacing'

import ExportRegionalBreakdown from './ExportRegionalBreakdown'
import {
  PageHeaderContainer,
  PageHeader,
  ContentContainer,
  SectionContainer,
  SectionHeader,
} from './styledComponents'

const MERCK_URL = '/api/merck-pipe-delimited-file'
const NOVARTIS_URL = '/api/novartis-csv-file'

const StyledButton = withStyles({
  root: {
    ...FontSpace.FS2,
    background: transparentize(0.85, Color.PRIMARY),
    color: Color.PRIMARY,
    fontWeight: 700,
    padding: Spacing.S3,
    textTransform: 'capitalize',
    '&:hover': {
      background: transparentize(0.7, Color.PRIMARY),
    }
  }
})(Button)

const ExportCustomData = () => {
  const { accessToken } = useAuth0()
  const [isMerckScriptLoading, setMerckLoadingStatus] = useState(false)
  const [isNvsScriptLoading, setNovartisLoadingStatus] = useState(false)

  const clickHandler = (url, setLoadingStatusFn) => async (e) => {
    e.preventDefault()
    setLoadingStatusFn(true)

    await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${ accessToken }`,
          'Content-Type': 'application/json'
        },
      })
      .then(async response => ({
        blob: await response.blob(),
        filename: response.headers.get('Content-Disposition').split("filename=")[1]
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
        <PageHeader>Export Custom Data</PageHeader>
      </PageHeaderContainer>
      <ContentContainer>
        <SectionContainer>
          <SectionHeader>Merck Pipe Delimited CSV and TXT Files</SectionHeader>
          <StyledButton
            size="small"
            onClick={clickHandler(MERCK_URL, setMerckLoadingStatus)}
          >
            <span style={{ margin: '0 4px 0 6px' }}>Download</span>
            { isMerckScriptLoading && <Spinner fill={Color.PRIMARY} />}
          </StyledButton>
        </SectionContainer>
        <SectionContainer>
          <SectionHeader>Kymriah Cart-T CSV File</SectionHeader>
          <StyledButton
            size="small"
            onClick={clickHandler(NOVARTIS_URL, setNovartisLoadingStatus)}
          >
            <span style={{ margin: '0 4px 0 6px' }}>Download</span>
            { isNvsScriptLoading && <Spinner fill={Color.PRIMARY} />}
          </StyledButton>
        </SectionContainer>
        <ExportRegionalBreakdown />
      </ContentContainer>
    </div>
  )
}

export default ExportCustomData
