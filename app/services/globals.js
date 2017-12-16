import Service from '@ember/service';

export default Service.extend({
  lastPolledAt: null,
  currentLocation: null/* {lat: null, lng: null} */,
});
