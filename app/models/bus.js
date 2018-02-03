import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { getDistanceFromLatLonInMiles } from 'transit-app/utils/gps-helper';
import { URLGenerator } from 'transit-app/utils/fetch';
import Notification from 'transit-app/utils/notification';
import ColorGenerator from '../utils/color-generator';

const roundOff = (value, precision) => Math.round((value) * Math.pow(10, precision))/ Math.pow(10, precision);

const googleStaticMapBaseURL = `https://maps.googleapis.com/maps/api/staticmap`;

const staticmap = size => ({get(){
  // https://maps.googleapis.com/maps/api/staticmap?center=33.8186363,-84.3718512&zoom=13&size=300x300&sensor=false
  const url = URLGenerator(googleStaticMapBaseURL, {
    // center: '33.8186363,-84.3718512',
    // zoom: '16',
    size,
    markers: [
      `size:tiny|color:red|${this.get('userLat')},${this.get('userLng')}`,
      `color:red|${this.get('lat')},${this.get('lng')}`,
    ],
    key: 'AIzaSyDUZ_JoVs7XrbCBNofu4QqfTO5HzefbUdk'

  });
  // const blob = await fetchBlob(url);
  // const imgUrl = window.URL.createObjectURL(blob);
  return url;
}});

export default EmberObject.extend({
  /* Attributes */
  userLat: '33.766856',
  userLng: '-84.367541',
  route: null,
  direction: null,
  blockAbbr: null,
  lat: null,
  lng: null,
  adherence: null,
  msgTime: null,
  timePoint: null,
  stopId: null,
  blockId: null,
  tripId: null,
  vechicle: null,

  notifyAtLeastDistance: 1, // in miles
  precision: 2,
  latLngUpdatedAt: null,

  /* Computed properties */
  latLng: computed('lat', 'lng', {
    get() {
      const lat = parseFloat(this.get('lat')), lng = parseFloat(this.get('lng'));
      return {lat, lng};
    }
  }),
  distanceAwayFromUser: computed('userLat', 'userLng', 'lat', 'lng', {
  get() {
    const { userLat, userLng, lat, lng } = this.getProperties('userLat', 'userLng', 'lat', 'lng');
    const coordArray =  [userLat, userLng, lat, lng];
    return coordArray.every(v => !!v) && getDistanceFromLatLonInMiles(userLat, userLng, lat, lng);
  }}),

  shouldNotify: computed('distanceAwayFromUser', 'notifyAtLeastDistance', {
    get() {
      return parseFloat(this.get('distanceAwayFromUser')) <= this.get('notifyAtLeastDistance');
    }
  }),

  color: computed({get() {
    return ColorGenerator();
  }}),

  directionIcon: computed('direction', {
  get(){
  const direction = this.get('direction');
  return {
    'northbound': 'arrow upward',
    'southbound': 'arrow downward',
    'eastbound' : 'arrow forward',
    'westbound' : 'arrow back',
  }[direction];
}}),

distanceText: computed('distanceAwayFromUser', {
  get(){
    return `${roundOff(this.get('distanceAwayFromUser'), this.get('precision'))} miles away`;
  }
}),

notify: function() {
  if(this.get('shouldNotify')) {
    const title = `Route ${this.get('route')} (${this.get('direction')})`;
    const body = `Bus is ${this.get('distanceText')} from you`;
    const image = this.get('staticMapImg');
    try {
      return Notification.create(title,{body, image});
    } catch(e) {
      console.error('Failed to create notification', e);
    }
  }
}.observes('distanceAwayFromUser'),

// _marker: computed('isMapThere', {
//   get() {
//     if(this.get('isMapThere')) {
//       const latLng= this.get('latLng'), map = this.get('mapObj');
//       const label = this.get('markerLabel');
//       return new google.maps.Marker({
//         position: latLng,
//         map: map,
//         label,
//       });
//     }
//   }
// }),

markerLabel: computed('route', 'direction', {
  get() {
    return `${this.get('route')}`;
  }
}),

// infoWindow: computed('_marker', {
//   get() {
//     const marker = this.get('_marker');
//     const map = this.get('mapObj');
//     if(this.get('isMapThere') && marker) {
//       const content = this.get('infoWindowContent');
//       const window = new google.maps.InfoWindow({
//         content,
//       });
//       window.open(map, marker);
//       return window;
//     }
//   }
// }),


// infoWindowContent: computed('distanceText', 'latLngUpdatedAt', {
//   get() {
//       const distanceText = this.get('distanceText');
//       const latLngUpdatedAt = this.get('latLngUpdatedAt');
//       return `
//       <h3>${distanceText}</h3>
//       <p>${moment(latLngUpdatedAt).format('LTS')}</p>
//       `;
//   } 
// }),

// markerFunc: function() {
//   const marker = this.get('_marker');
//   if(marker) {
//     const latLng = this.get('latLng');
//     const infoWindow = this.get('infoWindow');
//     const infoWindowContent = this.get('infoWindowContent');
//     marker.setPosition(latLng);
//     infoWindow.setContent(infoWindowContent);
//   }
  
// }.observes('latLngUpdatedAt'),

staticmapFullImg: computed('distanceAwayFromUser', staticmap('640x640')),

staticMapImg: computed('distanceAwayFromUser', staticmap('423x227')),


setLatLng({lat, lng}) {
  const oldLat = this.get('lat');
  const oldLng = this.get('lng');
  if(lat !=oldLat || lng != oldLng) {
    this.set('lat', lat);
    this.set('lng', lng);
    this.set('latLngUpdatedAt', moment().toDate());
  }

},

});