const REGEX_SCRAPER_COLLECTIONS = [
  /merckKeytruda_Policies/,
  /regeneronDupixent_Policies/,
  /novartisKymriah_Policies/,
]

const isScraperSheet = (wb) =>
  REGEX_SCRAPER_COLLECTIONS.some((rx) => rx.test(wb))

module.exports = {
  isScraperSheet,
}
