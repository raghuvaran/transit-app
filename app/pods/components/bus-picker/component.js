import Component from '@ember/component';
import { A as emberA} from '@ember/array';
import { computed, get } from '@ember/object';
import EObj from '@ember/object';
import { fetchJson } from '../../../utils/fetch';
import config  from 'ember-get-config';

const busObj = EObj.extend({
  route: null,
  direction: null,
});

export default Component.extend({
  // tagName: '',
  init() {
    this._super(...arguments);
    this.getAllBuses();
  },
  allBuses: emberA(),
  selectedBuses: emberA(),

  remainingBuses: computed('selectedBuses.[]', 'allBuses.[]', {
    get() {
      const allBuses = this.get('allBuses');
      const selectedBuses = this.get('selectedBuses');
      return allBuses.filter(b => !selectedBuses.any(_b => get(_b, 'route')==get(b,'route') && get(_b,'direction')==get(b,'direction')))
    }
  }),

  async getAllBuses() {
    const url = config&&config.environment=="development"&&"/assets/all-buses.json"||`/transit-app/assets/all-buses.json`;
    try {
      let buses = await fetchJson(url);
      buses = buses.map(b =>busObj.create({
        route: parseInt(b.route),
        direction: String(b.direction).toLowerCase()
      }));
      this.set('allBuses', buses);
    } catch(e) { console.error('Failed to fetch all-buses.json')}
  },
  actions: {
    addBus(bus) {
      // const selectedBuses = this.get('selectedBuses');
      // if(selectedBuses.indexOf(bus) == -1) {
      //   selectedBuses.push(bus);
      //   this.set('selectedBuses', selectedBuses);
      // }
      if(this.get('addBus')) return this.sendAction('addBus', bus);
      this.get('selectedBuses').pushObject(bus);
    },
    removeBus(bus) {
      // const selectedBuses = this.get('selectedBuses');
      // const newSelection = selectedBuses.filter(b => b !== bus);
      // this.set('selectedBuses', newSelection);
      if(this.get('removeBus')) return this.sendAction('removeBus', bus);
      this.get('selectedBuses').removeObject(bus);
    }
  }
});
