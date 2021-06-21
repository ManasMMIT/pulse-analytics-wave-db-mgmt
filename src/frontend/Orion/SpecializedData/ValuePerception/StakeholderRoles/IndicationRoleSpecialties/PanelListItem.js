import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { transparentize } from 'polished'

import { Button } from '@pulse-analytics/pulse-design-system'

import Color from 'frontend/utils/color'

import { ListItem } from '../../../../Administrator/ListsConfigManagement/shared/styledComponents'

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
  shouldShowDelete,
  labelKey,
}) => {
  const label = data[labelKey]

  const onClick = isSelected
    ? null
    : () => handleClick(data[searchParamKey], searchParam)
  const style = isSelected ? activeStyle : {}

  return (
    <ListItem onClick={onClick} style={style}>
      {label}
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
        {shouldShowDelete && (
          <TrashButton onClick={handleDelete}>
            <FontAwesomeIcon size="lg" icon={faTrashAlt} />
          </TrashButton>
        )}
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
  shouldShowEdit: PropTypes.bool,
  handleEdit: PropTypes.func,
  shouldShowDelete: PropTypes.bool,
  handleDelete: PropTypes.func,
}

PanelListItem.defaultProps = {
  shouldShowEdit: false,
  handleEdit: () => null,
  shouldShowDelete: false,
  handleDelete: () => null,
  labelKey: 'name',
}

export default PanelListItem
