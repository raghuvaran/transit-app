import Component from '@ember/component';
// import { htmlSafe } from '@ember/string';
export default Component.extend({
  tagName:'bus-card',
  // attributeBindings: ['style'],
  // style: htmlSafe('border-radius:15px;')

  actions:{
    openFullMap() {
      this.set('dialogOrigin', $(event.currentTarget));
      this.set('showDialog', true);
    },
    
  }
});
