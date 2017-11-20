import Component from '@ember/component';
import BusObject from 'transit-app/models/bus';
import {inject} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { alias, bool } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { fetchJson } from 'transit-app/utils/fetch';

const padding = 'http://cors-proxy.htmldriven.com/?url=';

const initialArray = () => emberArray();

const isGeoLocValid = (location) => location &&
 location.latitude && location.latitude >= -90 && location.latitude <= 90 &&
 location.longitude && location.longitude >= -180 && location.longitude <= 180 ;

export default Component.extend({
  globals: inject('globals'),
  geoloc: inject('geoloc'),
  tagName: 'buses-near-me',
  busURL: `${padding}http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus`,
  requestedBuses: [
    ["16", "northbound"],
    ["99", "northbound"],
    ["109", "northbound"],
    
  ].reduce((a,c) => {a[c[0]]=[c[1]]; return a},{}),
  activeBuses: initialArray(),
  // routes: EmberObject.computed.mapBy('buses', 'route'),
  currentLocation: {latitude: '33.766856', longitude: '-84.367541'},//alias('globals.currentLocation'),
  isGeoLocValid: bool('geoWatchId'),
  refreshInterval: null,

  init(){
    this._super(...arguments);
    const watchId = this.get('geoloc').subscribe();
    this.set('geoWatchId', watchId);
  },

  willDestroy(){
    this.get('geoloc').unSubscribe(this.get('geoWatchId'));
    this._super(...arguments);
  },

  async _getAllBusResponse() {
    const response = await fetchJson(this.get('busURL'));
    this.set('globals.lastPolledAt', moment().toDate());
    return JSON.parse(response.body);
  },

  _processResponse(response) {
    let {latitude: userLat, longitude: userLng} = this.get('currentLocation');

    response.forEach(b => {
      const allowedBus = this.get('requestedBuses')[b.ROUTE];
      // skip if bus doesn't match the criterion
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
        const newBusObj = BusObject.create(attrs);
        this.get('activeBuses').pushObject(newBusObj);
      }
      

    });
  },

  trackBusesTask: task(
    function*() {
      while(true) {

        let timeoutDuration = this.get('refreshInterval') || 2000;

        // make sure user location is present
        const currentLocation = this.get('currentLocation');
        if(isGeoLocValid(currentLocation)) {

          const response = yield this._getAllBusResponse();
          this._processResponse(response);

        }
        
        yield timeout(timeoutDuration);
        
      }
    }
  ),
  
  actions:{
    canceltrackBusesTask() {
      this.get('trackBusesTask').cancelAll();
      this.set('activeBuses', initialArray());
    },
    
  },
  
});

