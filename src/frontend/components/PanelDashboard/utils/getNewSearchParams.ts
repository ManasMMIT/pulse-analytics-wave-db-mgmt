const getNewSearchParams = (
  searchParamsAncestry: string[],
  searchParam: string,
  currentSearchParams: { [key: string]: string },
  newSearchInput: any
) => {
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

export default getNewSearchParams
