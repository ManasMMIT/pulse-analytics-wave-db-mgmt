class Base {
  hashPtps(datum) {
    return [
      datum.slug,
      datum.indication,
      datum.regimen,
      datum.line,
      datum.population,
      datum.book,
      datum.coverage,
    ].join('|')
  }

  hashBrcs(datum) {
    return [
      datum.book,
      datum.regimen,
      datum.coverage,
      datum.slug,
    ].join('|')
  }

  hashTpParts(datum) {
    return [
      datum.indication,
      datum.regimen,
      datum.line,
      datum.population,
      datum.book,
      datum.coverage,
    ].join('|')
  }

  POLICY_LINKS_hashTpParts(datum) {
    return [
      datum.regimen,
      datum.book,
      datum.coverage,
    ].join('|')
  }
}

module.exports = Base
