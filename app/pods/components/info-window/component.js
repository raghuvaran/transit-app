import Component from '@ember/component';
import jQuery from 'jquery';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import SHAPES from '../../../utils/shapes';
import { fetchJson } from '../../../utils/fetch';

const markerSVG = '/assets/252025.svg';

export default Component.extend({
  globals: inject(),

  init() {
    this._super(...arguments);
    const windowId = `info-window-${this.get('elementId')}`;
    const window = new google.maps.InfoWindow({
      content: `<div id="${windowId}"></div>`,
    });
    this.getShape();
    this.set('windowId', windowId);
    this.set('window', window);
  },


  willDestroyElement() {
    this._super(...arguments);
    const marker = this.get('marker');
    const markerListener = this.get('markerListener');
    marker && marker.setMap(null);
    google.maps.event.removeListener(markerListener);
    this.get('shape').setMap(null);
    
    console.log("Destroying marker ", this.get('bus.route'));
  },

  lastUpdatedAgo: computed('bus.latLngUpdatedAt', 'globals.lastPolledAt', {
    get() {
      const latLngUpdatedAt = this.get('bus.latLngUpdatedAt');
      this.get('globals.lastPolledAt');
      if(!latLngUpdatedAt) return;
      const marker = this.get('marker');
      if(!marker) {
        this.setMarker();
      } else {
        const latLng= this.get('bus.latLng');
        marker.setPosition(latLng);
      }
      return computeDiff(latLngUpdatedAt);
    }
  }),

  setMarker() {
    const map = this.get('map');    
    const latLng= this.get('bus.latLng');
    const label = this.get('bus.markerLabel');
    const windowId = this.get('windowId');
    const window = this.get('window');
    const color = this.get('bus.color');
    const defaultMarker = this.get('globals.defaultMarker');

    const markerIcon = {
      url: markerSVG,
      scaledSize: new google.maps.Size(80, 80),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(32,65),
      labelOrigin: new google.maps.Point(40,33)
    };

    const marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: latLng,
      map: map,
      label: {
        text: label,
        color,
        fontSize: "16px",
        fontWeight: "bold"
      },
      icon: defaultMarker?markerIcon:null
    });

    this.set('marker', marker);
    
    window.open(map, marker);
    const markerListener = marker.addListener('click', function() {
      window.open(map, marker);
    });

    this.set('markerListener', markerListener);
    
    jQuery(`#${windowId}`)[0].append(jQuery(`#${this.get('elementId')}`)[0]);
  },

  async getShape() {
    const shapes = await fetchJson(SHAPES[this.get('bus.route')]);
    const color = this.get('bus.color');
    const routeShape = new google.maps.Polyline({
      path: shapes,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.set('shape', routeShape);
    routeShape.setMap(this.get('map'));
  }
});


function computeDiff(past) {
  const ranges = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];
  let diff;
  for(const range of ranges) {
    diff = moment().diff(past, range, true);
    diff = precision(diff);
    if(diff < 60) return `${diff} ${range} ago`;
  }
  return `${diff} years ago`;
}

function precision(value) {
  return value && Math.round((value) * Math.pow(10, 2))/ Math.pow(10, 2);
}