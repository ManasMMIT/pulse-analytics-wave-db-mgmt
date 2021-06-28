import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Button } from '@pulse-analytics/pulse-design-system'

import SortableDragHandle from 'frontend/components/SortableDragHandle'
import Color from 'frontend/utils/color'

import { ListItem } from '../../../../../Administrator/ListsConfigManagement/shared/styledComponents'

const activeStyle = {
  background: transparentize(0.9, Color.PRIMARY),
  color: Color.PRIMARY,
  fontWeight: 700,
}

const TrashButton = styled.button({
  color: transparentize(0.7, Color.BLACK),
  cursor: 'pointer',
  ':hover': {
    background: transparentize(0.9, Color.BLACK),
  },
})

const PanelListItem = ({
  data,
  isSelected,
  handleEdit,
  searchParamKey,
  handleClick,
  searchParam,
  handleDelete,
  shouldShowEdit,
}) => {
  const { name } = data

  const onClick = isSelected
    ? null
    : () => handleClick(data[searchParamKey], searchParam)
  const style = isSelected ? activeStyle : {}

  return (
    <ListItem onClick={onClick} style={style}>
      <SortableDragHandle />
      {name}
      <section>
        {shouldShowEdit && (
          <Button
            onClick={handleEdit}
            type="secondary"
            style={{ padding: '6px 12px', margin: '0 12px' }}
          >
            Edit
          </Button>
        )}
        <TrashButton onClick={handleDelete}>
          <FontAwesomeIcon size="lg" icon={faTrashAlt} />
        </TrashButton>
      </section>
    </ListItem>
  )
}

PanelListItem.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  searchParamKey: PropTypes.string.isRequired,
  searchParam: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  shouldShowEdit: PropTypes.bool,
}

PanelListItem.defaultProps = {
  handleEdit: () => null,
  shouldShowEdit: false,
}
export default PanelListItem
