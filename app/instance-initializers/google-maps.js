import $ from 'jquery';
import config  from 'ember-get-config';

const key = config.googleMapsKey;
export function initialize(appInstance) {
  // appInstance.inject('route', 'foo', 'service:foo');
  const geoloc = appInstance.lookup('service:geoloc');
  
  // application.inject('route', 'foo', 'service:foo');
  geoloc.forceGetCurrentPosition({lat: '33.766856', lng: '-84.367541'}); 
  window.initMap = function() { return $.getScript(`https://maps.googleapis.com/maps/api/js?key=${key}`) };
}

export default {
  initialize
};
