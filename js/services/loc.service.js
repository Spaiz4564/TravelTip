import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const locService = {
  getLocs,
  getLocsForDisplay,
  getLocById,
  removeLoc,
  addLoc,
}

_createLocs()

function getLocs() {
  return storageService.query('locsDB')
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
  loc.createdAt = Date.now()
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function _createDemoLocs() {
  const locNames = ['Tel Aviv', 'Munich', 'Yavne']
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
