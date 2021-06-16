const mapSchemaVegaToMongo = ({
  id,
  name,
  description,
  products_regimens,
  categories,
}) => {
  const productsRegimens = products_regimens.map(({
    id,
    product,
    regimen,
  }) => ({
    id,
    product: {
      _id: product.id,
      brandName: product.brand_name,
      genericName: product.generic_name,
      logoLink: product.logo_link,
    },
    regimen: {
      _id: regimen.id,
      name: regimen.name,
    }
  }))

  const mongoCategories = categories.map(({
    id,
    name,
    prompt,
  }) => ({
    _id: id,
    name,
    prompt,
  }))

  return {
    _id: id,
    name,
    description,
    productsRegimens,
    categories: mongoCategories,
    materialized_at: new Date(),
  }
}

export default mapSchemaVegaToMongo
