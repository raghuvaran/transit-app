import Component from '@ember/component';
import BusObject from '../../../models/bus';
import {inject} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { alias, bool, reads, sort } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { fetchJson } from 'transit-app/utils/fetch';
import { isGeoLocValid } from '../../../utils/gps-helper';

const padding = 'https://people.cs.clemson.edu/~rchowda/cors/?';

const initialArray = () => emberArray();

export default Component.extend({
  globals: inject('globals'),
  geoloc: inject('geoloc'),
  debug: inject('debugger-log'),
  tagName: 'buses-near-me',
  classNames: ['layout-column', 'flex-grow'],
  busURL: `${padding}http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus`,
  _requestedBuses: computed({
    get() {
      const cache = window.localStorage.getItem('requestedBuses');
      let returnable = JSON.parse(cache);
      returnable = Array.isArray(returnable) && returnable || emberArray();
      return returnable;
    },
    set(key, value) {
      const newValue = JSON.stringify(value);
      window.localStorage.setItem('requestedBuses', newValue);
      return this.get('_requestedBuses');
    }
  }),
  requestedBuses: computed('_requestedBuses.[]', {
    get() {
      const hash = {};
      this.get('_requestedBuses').forEach(b => {
        hash[b.route] = hash[b.route] || [];
        const directions = hash[b.route];
        const direction = String(b.direction).toLowerCase();
        if(directions.indexOf(direction) === -1) {
          hash[b.route].push(direction);
        }
      });
      return hash;
    }
  }),
  activeBuses: initialArray(),
  activeBusSorting: ['distanceAwayFromUser:asc'],
  sortedActiveBuses: sort('activeBuses', 'activeBusSorting'),
  // routes: EmberObject.computed.mapBy('buses', 'route'),
  currentLocation: /* {lat: '33.766856', lng: '-84.367541'}, */alias('globals.currentLocation'),
  isGeoLocValid: bool('geoWatchId'),
  refreshInterval: null,
  debugTapCount: 5,
  debugMode: reads('debug.isActive'),  
  debugLog: emberArray(),

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
    return response;
  },

  _processResponse(response) {
    let {lat: userLat, lng: userLng} = this.get('currentLocation');
    const requestedBuses = this.get('requestedBuses');
    response.forEach(b => {
      const allowedBus = requestedBuses[b.ROUTE];
      // skip if bus doesn't match the criterion
      if(!allowedBus || allowedBus.indexOf( String(b.DIRECTION).toLowerCase()) === -1) {
        /* console.log('returning', b, this.get('requestedBuses'), allowedBus); */
         return;
        };

      const bus = this.get('activeBuses').findBy('blockAbbr', b.BLOCK_ABBR);
      const attrs = {
        userLat,
        userLng,
        route: b.ROUTE,
        direction: String(b.DIRECTION).toLowerCase(),
        blockAbbr: b.BLOCK_ABBR,
        // lat: b.LATITUDE,
        // lng: b.LONGITUDE,
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
        bus.setLatLng({
          lat: b.LATITUDE,
          lng: b.LONGITUDE,
        });
        bus.setProperties(attrs);
      }else {
        const newBusObj = BusObject.create(attrs);
        this.get('activeBuses').pushObject(newBusObj);
      }
      

    });
  },

  trackBusesTask: task(
    function*() {
      try{

        while(true) {

          let timeoutDuration = this.get('refreshInterval') || 2000;

          // make sure user location is present
          const currentLocation = this.get('currentLocation');
          // const debugMode = this.get('debugMode');

          /*debug************************************************/ this.get('debug').logger(`Validating current location ${JSON.stringify(currentLocation)}`);

          if(isGeoLocValid(currentLocation)) {
            /*debug************************************************/ this.get('debug').logger(`Current location is valid`);
            this.set('locationInvalid', false);
            
            let start_time = moment();
            const response = yield this._getAllBusResponse();
            /*debug************************************************/ this.get('debug').logger(`Fetch completed in ${moment().diff(start_time, 'seconds')} seconds`);
            this._processResponse(response);
            start_time = moment();
            /*debug************************************************/ this.get('debug').logger(`Processed response in ${moment().diff(start_time, 'seconds')} seconds`);
            
          }else {
            /*debug************************************************/ this.get('debug').logger(`Current location is NOT valid`);
            
            this.set('locationInvalid', true);
          }
          
          /*debug************************************************/ this.get('debug').logger(`sleeping for ${timeoutDuration} ms`);
          yield timeout(timeoutDuration);
          /*debug************************************************/ this.get('debug').logger(`woke up; ready to hit endpoint`);
          
        }
      } catch(e) {
        /*debug************************************************/ this.get('debug').logger(`API fetch errored ${e.message}`);
      }
    }
  ),
  
  actions:{
    canceltrackBusesTask() {
      this.get('trackBusesTask').cancelAll();
      this.get('activeBuses').forEach(b => b.destroy());
      this.set('activeBuses', initialArray());
    },

    forceGetCurrentPosition() {
      this.get('geoloc').forceGetCurrentPosition();
    },

    addBus(bus) {
      const arr = emberArray(this.get('_requestedBuses'));
      arr.pushObject(bus);
      this.set('_requestedBuses', arr);
    },
    removeBus(bus) {
      const arr = emberArray(this.get('_requestedBuses'));
      arr.removeObject(bus);
      this.set('_requestedBuses', arr);      
    },
    
    activateDebugMode() {
      if(this.get('debug.isActive')) return;

      this.decrementProperty('debugTapCount');
      if(this.get('debugTapCount') < 1) this.set('debug.isActive', true);
    },

    deactivateDebugMode() {
      this.set('debug.isActive', false);
    },

    clearDebugLog() {
      /*debug************************************************/ this.get('debug').clearDebugLog();
    },

    popDebugLog(dl) {
      /*debug************************************************/ this.get('debug').popDebugLog(dl);      
    }
    
  },
  
});

