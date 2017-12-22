import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject} from '@ember/service';


export default Component.extend({
  globals: inject('globals'),
  
  tagName: 'full-map',
  map: null,

  init() {
    this._super(...arguments);
    window.initMap()
    .done(_ => this.initMap())
    .fail(_ => console.error('Failed to fetch the google maps script'));
    
  },
  
  initMap() {
    try {
      const currentLocation = this.get('globals.currentLocation');
      const map = new google.maps.Map(document.getElementById(`fullmap-${this.get('elementId')}`), {
        center: { lat: parseFloat(currentLocation.lat), lng: parseFloat(currentLocation.lng) },
        zoom: 14,
      });
      this.set('map', map);
    }catch(e) {
      console.error('Failed to init map!', e);
    }
  },

  userLocation: computed('globals.currentLocation', {
    get() {
      const {lat, lng} = this.get('globals.currentLocation');
      const map = this.get('map')
      let marker = this.get('userMarker');
      if(!marker){
        marker = new google.maps.Marker({
          position: {lat, lng},
          map: map,
          label: 'U',
        });
        this.set('userMarker', marker);
      } else {
        marker.setPosition({lat, lng});
      }

    }
  }),


  willDestroyElement() {
    this._super(...arguments);
    const userMarker = this.get('userMarker');
    userMarker && userMarker.setMap(null);
  }

});
