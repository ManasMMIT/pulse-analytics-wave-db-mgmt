/*
  ? Strat here is to go one row at a time and have it trip validation and build its errors
    * once we've gone through the entire sheet, if there are errors, throw them to the frontend

  ! a row fails validation if
  - Missing required field (handle in typedefs)
  - Does not have one of prod/reg/manId fields (need to check in resolver)
  - Rating is not within the market basket's set range
  - Category is not included in marketBasket
  - Characteristic is not included in marketBasket
  - Product is not includeded in marketBasket
  - Regimen is not included in marketBasket
  - Manufacturer is not associated with a product in the market basket
*/

module.exports = async ({
  data,
  marketBasketId,
  surveyId,
}) => data
