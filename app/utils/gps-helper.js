// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 0.621371; // Distance in miles
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

const isGeoLocValid = (location) => location &&
location.lat && location.lat >= -90 && location.lat <= 90 &&
location.lng && location.lng >= -180 && location.lng <= 180 ;

export { getDistanceFromLatLonInMiles, isGeoLocValid };