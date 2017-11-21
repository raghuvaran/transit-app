import Component from 'ember-paper/components/paper-subheader';

export default Component.extend({
  click() {
    this.sendAction('onClick')
  }
});
