export const locService = {
  getLocs,
}

// 4. Build the placeService managing Places:
// {id, name, lat, lng, weather, createdAt, updatedAt}
// a. NOTE: this service should work with the async-storage.service
// 5. Render the places table:
// Locations Table
// a. Show the place information

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}
