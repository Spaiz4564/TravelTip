import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onMoveToLoc = onMoveToLoc
window.onRemovePlace = onRemovePlace
window.onSearchLocation = onSearchLocation

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .then(() => {
      locService.getLocs().then((locs) => {
        renderLocations(locs)
      })
    })
    .catch(() => console.log('Error: cannot init map'))
}

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

function onMoveToLoc(lat, lng) {
  console.log(lat, lng)
  mapService.panTo(lat, lng)
}

function onRemovePlace(id) {
  console.log(id)
  locService.removeLoc(id).then(() => {
    locService.getLocs().then((locs) => {
      renderLocations(locs)
    })
  })
}

function renderLocations(locs) {
  console.log(locs)
  const strHTML = locs.map(
    (l) => `<div onclick="onMoveToLoc(${l.lat},${l.lng})" class="card">
    <div class="weather-createdAt">
    <p>${l.name}</p>
    <p class="remove-btn" onclick="onRemovePlace('${l.id}')">X</p>
    </div>
    <p>${l.createdAt}</p>
  </div>`
  )
  document.querySelector('.locs').innerHTML = strHTML.join('')
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerHTML = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
      mapService.addMarker({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

function onSearchLocation(ev) {
  ev.preventDefault()
  const search = ev.target.querySelector('input[name="location"]').value
  console.log(search)
  locService.searchLocs(search).then((res) => {
    console.log(res)
    mapService.panTo(res.lat, res.lng)
    mapService.addMarker({ lat: res.lat, lng: res.lng })
  })
}
