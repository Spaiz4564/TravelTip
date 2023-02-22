import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const locService = {
  getLocs,
  getLocsForDisplay,
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

function _createLoc(name) {
  const loc = getEmptyLoc()
  loc.name = name || utilService.makeLorem(10)
  loc.lat = utilService.getRandomIntInclusive(29.5, 32.5)
  loc.lng = utilService.getRandomIntInclusive(34.5, 36.5)
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
  const locs = locNames.map((name) => _createLoc(name))
  utilService.saveToStorage('locsDB', locs)
  return locs
}

function getLocsForDisplay() {
  return getLocs()
}
