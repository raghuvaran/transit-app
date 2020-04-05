import Component from '@ember/component';
export default Component.extend({
  tagName:'bus-card',

  actions:{
    openFullMap(event) {
      this.set('dialogOrigin', event.currentTarget);
      this.set('showDialog', true);
    },
    
  }
});
