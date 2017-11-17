import Controller from '@ember/controller';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { fetchJson } from 'transit-app/utils/fetch';
import { getDistanceFromLatLonInMiles } from 'transit-app/utils/gps-helper';

const padding = 'http://cors-proxy.htmldriven.com/?url=';

const busObject = EmberObject.extend({
  distanceFromUser: computed('userLat', 'userLng', 'lat', 'lng', function() {
    const { userLat, userLng, lat, lng } = this.getProperties('userLat', 'userLng', 'lat', 'lng');
    const coordArray =  [userLat, userLng, lat, lng];
    return coordArray.every(v => !!v) && getDistanceFromLatLonInMiles(userLat, userLng, lat, lng);
  })
});

export default Controller.extend({
  busURL: `${padding}http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus`,
  buses: [
    ["16", "southbound"],
    ["99", "northbound"],
    ["109", "northbound"],
    
  ].map(b => busObject.create({route: b[0], direction: b[1]})),
  // routes: EmberObject.computed.mapBy('buses', 'route'),
  currentLocation: null,
  refreshInterval: null,
  init(){
    this._super(...arguments);
    // this.get('trackBusesTask').perform();
  },

  getDeviceLocation(){
    //request and return lat, long
    this.set('currentLocation', [33.766601, -84.367538]);
  },
  
  async getAllResponse() {
    const response = await fetchJson(this.get('busURL'));
    return JSON.parse(response.body);
  },

  trackBusesTask: task(
    function*() {
      while(true) {

        let timeoutDuration = this.get('refreshInterval') || 2000;
        yield timeout(timeoutDuration);

        // make sure user location is present
        if(!this.get('currentLocation')) {
          this.getDeviceLocation();
        }
        let [userLat, userLng] = [this.get('currentLocation')[0], this.get('currentLocation')[1]];
        let response = yield this.getAllResponse();

        response.forEach(trip => {
            const bus = this.get('buses').findBy('route', trip.ROUTE);
            if(!bus || bus.get('direction') !== trip.DIRECTION.toLowerCase()) return;

            bus.setProperties({
              userLat, userLng,
              lat: trip.LATITUDE,
              lng: trip.LONGITUDE,
              adherence: trip.ADHERENCE,
              msgTime: trip.MSGTIME,
            });
        });
      }
    }
  ),
  
  actions:{
  },
  
});

