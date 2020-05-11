import { useQuery } from '@apollo/react-hooks'

import {
  GET_SOURCE_INDICATIONS,
  GET_SOURCE_REGIMENS,
  GET_BOOKS,
  GET_LINES,
  GET_POPULATIONS,
  GET_COVERAGES,
} from './../api/queries'

export default () => {
  const {
    data: indicationData,
    loading: indicationLoading,
  } = useQuery(GET_SOURCE_INDICATIONS)

  const {
    data: regimenData,
    loading: regimenLoading,
  } = useQuery(GET_SOURCE_REGIMENS)

  const {
    data: bookData,
    loading: bookLoading,
  } = useQuery(GET_BOOKS)

  const {
    data: lineData,
    loading: lineLoading,
  } = useQuery(GET_LINES)

  const {
    data: populationData,
    loading: populationLoading,
  } = useQuery(GET_POPULATIONS)

  const {
    data: coverageData,
    loading: coverageLoading,
  } = useQuery(GET_COVERAGES)

  const loading = [
    indicationLoading,
    regimenLoading,
    bookLoading,
    lineLoading,
    populationLoading,
    coverageLoading,
  ].some(loading => loading)

  let data = {}
  if (!loading) {
    data = {
      ...indicationData,
      ...regimenData,
      ...bookData,
      ...lineData,
      ...populationData,
      ...coverageData,
    }
  }

  return ({
    loading,
    data
  })
}
