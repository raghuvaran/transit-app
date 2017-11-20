import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { getDistanceFromLatLonInMiles } from 'transit-app/utils/gps-helper';
import { URLGenerator } from 'transit-app/utils/fetch';
import Notification from 'transit-app/utils/notification';

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
    key: 'AIzaSyAvZ7tmNKxBquUZZ_2m2jVxbGY8m4T-A9E'

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

  /* Computed properties */
  distanceAwayFromUser: computed('userLat', 'userLng', 'lat', 'lng', {
  get() {
    const { userLat, userLng, lat, lng } = this.getProperties('userLat', 'userLng', 'lat', 'lng');
    const coordArray =  [userLat, userLng, lat, lng];
    return coordArray.every(v => !!v) && getDistanceFromLatLonInMiles(userLat, userLng, lat, lng);
  }}),

  shouldNotify: computed('distanceAwayFromUser', 'notifyAtLeastDistance', {
    get() {
      return this.get('distanceAwayFromUser') <= this.get('notifyAtLeastDistance');
    }
  }),

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
    return Notification.create(title,{body, image});
  }
}.observes('distanceAwayFromUser'),

staticmapFullImg: computed('distanceAwayFromUser', staticmap('640x640')),

staticMapImg: computed('distanceAwayFromUser', staticmap('423x227')),



});