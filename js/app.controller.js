import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onMoveToLoc = onMoveToLoc
window.onRemovePlace = onRemovePlace

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs)
    renderLocations(locs)
    // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
  })
}

function onMoveToLoc(lat, lng) {
  console.log(lat, lng)
}

function onRemovePlace(id) {
  console.log(id)
}

function renderLocations(locs) {
  console.log(locs)
  const strHTML = locs.map(
    l => `<div onclick="onMoveToLoc(${l.lat},${l.lng})" class="card">
    <div class="weather-createdAt">
    <p>${l.name}</p>
    <p onclick="onRemovePlace('${l.id}')">X</p>
    </div>
    <p>${l.createdAt}</p>
  </div>`
  )
  document.querySelector('.locs').innerHTML = strHTML.join('')
}

function onGetUserPos() {
  getPosition()
    .then(pos => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch(err => {
      console.log('err!!!', err)
    })
}
function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

//we need to build a Enable the user to pick a place by clicking on the map.
