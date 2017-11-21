import Service from '@ember/service';
import { A as emberArray } from '@ember/array';

const initialArray = () => emberArray();

export default Service.extend({
  isActive: false,
  log: emberArray(),

  logger(log) {
      this.get('isActive') &&
      this.get('log').pushObject(log);
  },

  clearDebugLog() {
    this.set('log', initialArray());
  },

  popDebugLog(dl) {
    this.get('log').removeObject(dl);
  }
});
