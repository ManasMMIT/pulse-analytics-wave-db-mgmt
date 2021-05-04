import queryString from 'query-string'

const getNewSearchParams = (
  searchParamsAncestry: string[],
  searchParam: string,
  currentSearchParams: { [key: string]: string },
  newSearchInput: any
): { [key: string]: any } => {
  const newSearchParams: { [key: string]: any } = {}

  searchParamsAncestry.forEach((searchParamsAncestor: string) => {
    if (searchParamsAncestor === searchParam) {
      newSearchParams[searchParamsAncestor] = newSearchInput
    } else {
      newSearchParams[searchParamsAncestor] = currentSearchParams[searchParamsAncestor]
    }
  })

  return newSearchParams
}

function pushNewSearchParams(
  searchParamsAncestry: string[],
  searchParam: string,
  currentSearchParams: { [key: string]: string },
  history: { [key: string]: any }
) {
  return (newSearchInput: any) => {
    const newSearchParams = getNewSearchParams(
      searchParamsAncestry,
      searchParam,
      currentSearchParams,
      newSearchInput
    )
    
    history.push({
      search: queryString.stringify(newSearchParams),
    })
  }
}

export { getNewSearchParams, pushNewSearchParams }
