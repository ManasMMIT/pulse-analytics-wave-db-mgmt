const caseInsensitiveSort = (a, b) =>
  a.label.toLowerCase().localeCompare(b.label.toLowerCase())

export default caseInsensitiveSort
