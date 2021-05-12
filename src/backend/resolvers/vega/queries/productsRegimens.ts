import axios from 'axios'

const BASE_URI = 'product-regimens/'

interface VegaProdRegQueryInput {
  productId?: String
}

const vegaProductsRegimens = async (parent, args: { input: VegaProdRegQueryInput }, context, info) => {
  const finalUri = getUri(args.input || {})
  return axios.get(finalUri).then(({ data }) => data)
}

export default vegaProductsRegimens

const getUri = (input: VegaProdRegQueryInput): string => {
  const { productId } = input

  const productUriFilter = productId ? `?product__id__in=${productId}` : ''
  const finalUri = BASE_URI + productUriFilter
  return finalUri
}

