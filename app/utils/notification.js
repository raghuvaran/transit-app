export default class Notification {
  static async create(title, options) {
    options.timestamp = Date.now();
    if(this.hasAccess() || (await this.requestPermission()) && this.hasAccess()) {
      try{
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, options);
      } catch(e) {
        console.warn('Failed to showNotification via service worker');
        new window.Notification(title, options);
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