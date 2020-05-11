require('dotenv').config()
const fetch = require('node-fetch')

const getGeocodingData = async address => {
  const uriEncodedAddress = encodeURIComponent(address)

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${process.env.GOOGLE_API_KEY}`,
  ).then(res => res.json())

  if (response && response.results && response.results[0]) {
    const { lat, lng: long } = response.results[0].geometry.location
    return { lat, long }
  }

  return false
}

module.exports = getGeocodingData
