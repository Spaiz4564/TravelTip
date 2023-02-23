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
      document.querySelector('.user-pos').innerHTML = 'Tel Aviv'
      setQueryParams({ lat: 32.0749831, lng: 34.9120554 })
      renderWeather(32.0749831, 34.9120554)
    })
    .then(() => {
      locService.getLocs().then((locs) => {
        renderLocations(locs)
      })
    })
    .catch(() => console.log('Error: cannot init map'))
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  const pos = mapService.getClickedPos()
  mapService.addMarker(pos)
  const posName = locService.getPosName(pos.lat, pos.lng)
  posName
    .then((res) => {
      document.querySelector('.user-pos').innerHTML = res
    })
    .then(() => {
      const pos = mapService.getClickedPos()
      const name = document.querySelector('.user-pos').innerText
      locService.addClickedLocation(pos, name)
      setQueryParams({ lat: pos.lat, lng: pos.lng })
    })
    .then(() => {
      locService.getLocs().then((locs) => {
        renderLocations(locs)
      })
    })
}

function onMoveToLoc(lat, lng) {
  mapService.panTo(lat, lng)
  renderWeather(lat, lng)
  setQueryParams({ lat, lng })
}

function onRemovePlace(id, e) {
  e.stopPropagation()
  locService.removeLoc(id).then(() => {
    locService.getLocs().then((locs) => {
      renderLocations(locs)
    })
  })
}

function renderLocations(locs) {
  const strHTML = locs.map(
    (
      location
    ) => `<div onclick="onMoveToLoc(${location.lat},${location.lng})" class="card">
    <div class="weather-createdAt">
    <p>${location.name}</p>
    <p class="remove-btn" onclick="onRemovePlace('${location.id}', event)"><i class="fa-solid fa-xmark"></i></p>
    </div>
    <p>${location.createdAt}</p>
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
    .catch((err) => {})
}
function onPanTo() {
  mapService.panTo(35.6895, 139.6917)
}

function onSearchLocation(ev) {
  ev.preventDefault()
  const search = ev.target.querySelector('input[name="location"]').value
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
  window.history.pushState({ path: url.href }, '', url.href) //modify the URL of the current page without reloading the page
}

function renderWeather(lat, lng) {
  mapService.getWeather(lat, lng).then((res) => {
    const celciusTemp = Math.round(parseFloat(res.temp) - 273.15)
    const strHTML = `<div class="weather">
    <i class="fa-solid fa-cloud"></i> 
      <h2 class="status">${
        res.description.charAt(0).toUpperCase() + res.description.slice(1)
      }</h2>
      </div>
      <h2 class="temp">${celciusTemp}&#176;</h2>
     `
    document.querySelector('.weather-today').innerHTML = strHTML
  })
}
