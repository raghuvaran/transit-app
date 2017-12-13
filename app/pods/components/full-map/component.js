import Component from '@ember/component';
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
      const map = new google.maps.Map(document.getElementById(this.get('elementId')), {
        center: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        zoom: 16,
      });
      this.set('map', map);
    }catch(e) {
      console.error('Failed to init map!', e);
    }
  }
});
