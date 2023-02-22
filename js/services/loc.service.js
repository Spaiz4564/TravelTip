import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const locService = {
  getLocs,
  getLocsForDisplay,
  getLocById,
  removeLoc,
  addLoc,
  getDate,
  searchLocs,
  getPosName,
}

const API_KEY = 'AIzaSyAXB9zBhbRkr8a-2c7o9w11bA-2VfhmRX4'
const WEATHER_KEY = '8062575da50bcd590cba16adea5d20e6'

_createLocs()

function getLocs() {
  return storageService.query('locsDB')
}

function getDate() {
  return utilService.makeDate()
}

function _createLocs() {
  const locs = utilService.loadFromStorage('locsDB')
  if (!locs || !locs.length) {
    _createDemoLocs()
  }
}

function _createLoc(name, pos) {
  const loc = getEmptyLoc()
  loc.name = name || utilService.makeLorem(10)
  loc.lat = pos.lat || utilService.getRandomIntInclusive(32.5, 34.5)
  loc.lng = pos.lng || utilService.getRandomIntInclusive(34.5, 35.5)
  console.log(loc.lat, loc.lng)
  loc.createdAt = getDate()
  loc.updatedAt = Date.now()
  return loc
}

function getEmptyLoc() {
  return {
    id: utilService.makeId(),
    name: '',
    lat: 0,
    lng: 0,
    weather: '',
    createdAt: getDate(),
    updatedAt: Date.now(),
  }
}

function _createDemoLocs() {
  const locNames = ['Tel aviv', 'Munich', 'Yavne']
  const locPos = [
    { lat: 32.08605454733057, lng: 34.781365982678444 },
    { lat: 48.1351253, lng: 11.5819805 },
    { lat: 31.87782213831257, lng: 34.73996595503225 },
  ]
  const locs = locNames.map((name, idx) => {
    return _createLoc(name, locPos[idx])
  })
  utilService.saveToStorage('locsDB', locs)
}

function getLocsForDisplay() {
  return getLocs()
}

function getLocById(locId) {
  return storageService.get('locsDB', locId)
}

function addLoc(loc) {
  return storageService.post('locsDB', loc)
}

function removeLoc(locId) {
  return storageService.remove('locsDB', locId)
}

function searchLocs(searchStr) {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${searchStr}&key=${API_KEY}`
    )
    .then(res => res.data)
    .then(data => {
      const { lat, lng } = data.results[0].geometry.location
      const { long_name: name } = data.results[0].address_components[0]
      return { lat, lng, name }
    })
    .then(loc => {
      const newLoc = _createLoc(loc.name, loc)
      return storageService.post('locsDB', newLoc)
    })
}

function getPosName(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
  console.log(url)
  return axios
    .get(url)
    .then(res => res.data)
    .then(data => {
      console.log(data.results[7].formatted_address)
      return data.results[7].formatted_address
    })
}

function getWeather() {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${WEATHER_KEY}`
  // console.log(url)
  return axios.get(url).then(res => console.log(res))
}

getWeather()
