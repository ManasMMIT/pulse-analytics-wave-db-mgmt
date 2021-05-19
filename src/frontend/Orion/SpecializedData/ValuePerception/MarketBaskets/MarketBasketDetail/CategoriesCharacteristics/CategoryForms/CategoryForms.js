import React from 'react'
import PropTypes from 'prop-types'

import CreateCategoryForm from './CreateCategoryForm'
import UpdateCategoryForm from './UpdateCategoryForm'
import DeleteCategoryForm from './DeleteCategoryForm'

const FORM_MAP = {
  create: CreateCategoryForm,
  update: UpdateCategoryForm,
  delete: DeleteCategoryForm,
}

const CategoryForms = ({
  opType,
  closeHandler,
  categories,
  handleListItemSearchUpdate,
}) => {
  const Component = FORM_MAP[opType]
  return (
    <Component
      closeHandler={closeHandler}
      categories={categories}
      handleListItemSearchUpdate={handleListItemSearchUpdate}
    />
  )
}

CategoryForms.propTypes = {
  opType: PropTypes.string.isRequired,
  closeHandler: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
}

export default CategoryForms
