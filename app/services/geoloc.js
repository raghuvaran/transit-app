import Service from '@ember/service';
import {inject} from '@ember/service';

const clearWatch = function(watchId){
  navigator.geolocation.clearWatch(watchId);
};

const watchPosition = function(){
  let watchId = navigator.geolocation.watchPosition(...arguments);
  return watchId;
};

/**
 * @module Services
 */
/**
 * Service with geocode related functionalities.
 * @class Services.geocode
 */
export default Service.extend({
  globals: inject('globals'),

  /**
   * Unsubscribes from the user's lat & lng values change events
   * @method subscribe
   * @param {Number} watchId, a token to unsubscribe
   */
  unSubscribe(watchId){
    clearWatch(watchId);
  },
  
  /**
   * Subscribes to the user's lat & lng values change events
   * @method subscribe
   * @return watchId, a token to unsubscribe
   */
  subscribe() {
    var that = this;
    var watchId;

    if(!navigator || !navigator.geolocation) return null; // if the device doesn't support geolocation api

    function onSuccess(position) {
      that.set("globals.currentLocation", { latitude: position.coords.latitude, longitude: position.coords.longitude });
    }
    
    function onError(error) {
      clearWatch(watchId);
    }

    watchId = watchPosition(onSuccess, onError);
    return watchId;
  },
});
