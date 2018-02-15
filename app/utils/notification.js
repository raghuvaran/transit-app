export default class Notification {
  static async create() {
    if(this.hasAccess() || (await this.requestPermission()) && this.hasAccess()) {
      try{
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(...arguments);
      } catch(e) {
        console.warn('Failed to showNotification via service worker');
        new window.Notification(...arguments);
      }
    }
  }

  static hasAccess() {
    if(window.Notification.permission === "granted") return true;
    if(window.Notification.permission === "denied") return false;
    return null; // default
  }

  static requestPermission(callback){
    return window.Notification.requestPermission();
  }
}