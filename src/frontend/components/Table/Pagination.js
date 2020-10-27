import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
// Riff on https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination?file=/src/App.js:2454-3775

import Color from 'frontend/utils/color'
import Icon from 'frontend/components/Icon'

const ArrowControl = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const ArrowButton = styled.button({
  cursor: 'pointer',
  padding: '0 4px',
  borderRadius: 4,
  ':hover': {
    background: transparentize(0.85, Color.PRIMARY),
  },
})

const Text = styled.span({
  fontSize: 12,
  color: Color.BLACK,
})

const inputStyles = {
  border: `1px solid ${transparentize(0.9, Color.BLACK)}`,
  borderRadius: 4,
  fontSize: 12,
  padding: '4px 8px',
  ':hover': {
    boxShadow: `0 0 0 2px ${Color.PRIMARY}`,
  },
  ':focus': {
    boxShadow: `0 0 0 2px ${Color.PRIMARY}`,
  },
}

const PageSelect = styled.input({
  ...inputStyles,
  width: 60,
})

const OptionSelect = styled.select({
  ...inputStyles,
})

const iconColor = transparentize(0.7, Color.BLACK)

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 75, 100]

const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  // pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
}) => {
  return (
    <div
      className="pagination"
      style={{ paddingLeft: 24, display: 'flex', alignItems: 'center' }}
    >
      <ArrowControl>
        {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {'<<'}
      </button>{' '} */}
        <ArrowButton onClick={() => previousPage()} disabled={!canPreviousPage}>
          <Icon iconName="arrow-drop-left" color1={iconColor} width={16} />
        </ArrowButton>{' '}
        <Text style={{ margin: '0 8px' }}>
          <span style={{ fontWeight: 700 }}>{pageIndex + 1}</span> of{' '}
          {pageOptions.length}{' '}
        </Text>
        <ArrowButton onClick={() => nextPage()} disabled={!canNextPage}>
          <Icon iconName="arrow-drop-right" color1={iconColor} width={16} />
        </ArrowButton>{' '}
        {/* <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {'>>'}
      </button>{' '} */}
      </ArrowControl>
      <Text style={{ margin: '0 12px' }}>
        <span style={{ marginRight: 4 }}>Jump To:</span>
        <PageSelect
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
        />
      </Text>
      <OptionSelect
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}
      >
        {PAGE_SIZE_OPTIONS.map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Rows per Page: {pageSize}
          </option>
        ))}
      </OptionSelect>
    </div>
  )
}

export default Pagination
