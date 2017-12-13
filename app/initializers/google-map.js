import $ from 'jquery';

const key = 'AIzaSyDxkP6K5lh2VBZUVLMZW4YqvwseeDIb-PI';

export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');
  window.initMap = function() { return $.getScript(`https://maps.googleapis.com/maps/api/js?key=${key}`) }
}

export default {
  initialize
};
