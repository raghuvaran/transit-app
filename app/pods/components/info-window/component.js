import Component from '@ember/component';
import $ from 'jquery';
import { computed } from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  globals: inject(),

  init() {
    this._super(...arguments);
    const windowId = `info-window-${this.get('elementId')}`;
    const window = new google.maps.InfoWindow({
      content: `<div id="${windowId}"></div>`,
    });
    this.set('windowId', windowId);
    this.set('window', window);
  },


  willDestroyElement() {
    this._super(...arguments);
    const marker = this.get('marker');
    const markerListener = this.get('markerListener');
    marker && marker.setMap(null);
    google.maps.event.removeListener(markerListener);
    
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
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      label,
    });

    this.set('marker', marker);
    
    window.open(map, marker);
    const markerListener = marker.addListener('click', function() {
      window.open(map, marker);
    });

    this.set('markerListener', markerListener);
    
    $(`#${windowId}`)[0].append($(`#${this.get('elementId')}`)[0]);
  }
});


function computeDiff(past) {
  const ranges = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']
  let diff;
  for(const range of ranges) {
    diff = moment().diff(past, range, true);
    diff = precision(diff);
    if(diff < 60) return `${diff} ${range} ago`;
  }
  return `${diff} years ago`;
}

function precision(value) {
  return value && Math.round((value) * Math.pow(10, 2))/ Math.pow(10, 2)
}