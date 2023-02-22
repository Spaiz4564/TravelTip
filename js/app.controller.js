import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const controller = {
  onAddMarker,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.onMoveToLoc = onMoveToLoc
window.onRemovePlace = onRemovePlace
window.onSearchLocation = onSearchLocation
window.onCopyLocation = onCopyLocation

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
  const pos = mapService.getClickedPos()
  console.log('Adding a marker', pos)
  mapService.addMarker(pos)
  const posName = locService.getPosName(pos.lat, pos.lng)
  posName
    .then((res) => {
      document.querySelector('.user-pos').innerHTML = res
      console.log(res)
      locService.addClickedLocation(res, pos.lat, pos.lng)
      setQueryParams({ lat: pos.lat, lng: pos.lng })
    })
    .then(() => {
      locService.getLocs().then((locs) => {
        renderLocations(locs)
      })
    })
}

function onMoveToLoc(lat, lng) {
  console.log(lat, lng)
  mapService.panTo(lat, lng)
  setQueryParams({ lat, lng })
  const posName = locService.getPosName(lat, lng)
  posName
    .then((res) => {
      document.querySelector('.user-pos').innerHTML = res
      renderWeather(lat, lng)
    })
    .then(() => {
      locService.getPosName(lat, lng).then((res) => {
        locService.addLoc(res, lat, lng)
      })
    })
}

function onRemovePlace(id, e) {
  e.stopPropagation()
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
    <p class="remove-btn" onclick="onRemovePlace('${l.id}', event)"><i class="fa-solid fa-xmark"></i></p>
    </div>
    <p>${l.createdAt}</p>
  </div>`
  )
  document.querySelector('.locs').innerHTML = strHTML.join('')
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
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
  locService
    .searchLocs(search)
    .then((res) => {
      mapService.panTo(res.lat, res.lng)
      mapService.addMarker({ lat: res.lat, lng: res.lng })
      setQueryParams({ lat: res.lat, lng: res.lng })
      renderWeather(res.lat, res.lng)
    })
    .then(() => {
      locService.getLocs().then((locs) => {
        renderLocations(locs)
      })
    })

  document.querySelector('.user-pos').innerHTML = search
}

function onCopyLocation() {
  const locs = locService.getLocs()
  locs.then((res) => {
    const lastLoc = res[res.length - 1]
    const urlStr = `index.html?lat=${lastLoc.lat}&lng=${lastLoc.lng}`
    console.log(urlStr)
    navigator.clipboard.writeText(urlStr)
  })
}

function setQueryParams(newParams) {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)

  for (var paramName in newParams) {
    const paramValue = newParams[paramName]
    params.set(paramName, paramValue) // used to update an existing query string parameter or add a new one if it doesn't exist.
  }
  url.search = params.toString()
  console.log(url)
  window.history.pushState({ path: url.href }, '', url.href) //modify the URL of the current page without reloading the page
}

function renderWeather(lat, lng) {
  mapService.getWeather(lat, lng).then((res) => {
    const celciusTemp = Math.round(parseFloat(res.temp) - 273.15)
    const strHTML = `<div class="weather">
      <p>Weather:</p>
      <p>${res.description}</p>
      <p>Temperature:</p>
      <p>${celciusTemp}°C</p>
     
      </div>`
    document.querySelector('.weather-today').innerHTML = strHTML
  })
}
