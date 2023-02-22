import { locService } from './loc.service.js'

export const mapService = {
  initMap,
  panTo,
  addMarker,
  handleMouseClicks,
  getClickedPos,
}

// Var that is used throughout this Module (not global)
var gMap
var gClickedPos = null

var WEATHER_API = '771d657c519490928476077c19885b85'

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    handleMouseClicks()
  })
}

function getClickedPos() {
  return gClickedPos
}

function handleMouseClicks() {
  google.maps.event.addListener(gMap, 'click', function (event) {
    panTo(event.latLng.lat(), event.latLng.lng())
    gClickedPos = { lat: event.latLng.lat(), lng: event.latLng.lng() }
  })
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyBWWmFlAwBfXJuGKls-EwltdtlfudzwCps' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })

  return marker
}

function getWeather(lat, lng) {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API}`
    )
    .then((res) => {
      console.log(res.data)
      return res.data
    })
}
