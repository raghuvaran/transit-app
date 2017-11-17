import Controller from '@ember/controller';
import EmberObject from '@ember/object';
import {inject} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
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
  }),

  directionIcon: computed('direction', function() {
    const direction = this.get('direction');
    return {
      'northbound': 'arrow upward',
      'southbound': 'arrow downward',
      'eastbound' : 'arrow forward',
      'westbound' : 'arrow back',
    }[direction];
  })
});

export default Controller.extend({
  globals: inject('globals'),
  busURL: `${padding}http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus`,
  requestedBuses: [
    ["16", "southbound"],
    ["99", "northbound"],
    ["109", "northbound"],
    
  ].reduce((a,c) => {a[c[0]]=[c[1]]; return a},{}),
  activeBuses: emberArray(),
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
    this.set('globals.lastPolledAt', moment().toDate());
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

        response.forEach(b => {
          const allowedBus = this.get('requestedBuses')[b.ROUTE];
          // skipi if bus doesn't match the criterion
          if(!allowedBus || allowedBus[0] !== String(b.DIRECTION).toLowerCase()) return;

          const bus = this.get('activeBuses').findBy('blockAbbr', b.BLOCK_ABBR);
          const attrs = {
            userLat,
            userLng,
            route: b.ROUTE,
            direction: String(b.DIRECTION).toLowerCase(),
            blockAbbr: b.BLOCK_ABBR,
            lat: b.LATITUDE,
            lng: b.LONGITUDE,
            adherence: b.ADHERENCE,
            msgTime: b.MSGTIME,
            timePoint: b.TIMEPOINT,
            stopId: b.STOPID,
            blockId: b.BLOCKID,
            tripId: b.TRIPID,
            vechicle: b.VEHICLE
          };

          // if there is an existing bus, update it or else create and push it to the array
          if(isPresent(bus)) {
            bus.setProperties(attrs);
          }else {
            const newBusObj = busObject.create(attrs);
            this.get('activeBuses').pushObject(newBusObj);
          }
          

        });
      }
    }
  ),
  
  actions:{
  },
  
});

