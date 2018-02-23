export default class Notification {
  static async create(title, options) {
    options.timestamp = Date.now();
    if(this.hasAccess() || (await this.requestPermission()) && this.hasAccess()) {
      try{
        const reg = await navigator.serviceWorker.ready;
        const currentNotifications = await reg.getNotifications();
        this.closeExiting(currentNotifications, options);
        reg.showNotification(title, options);
      } catch(e) {
        console.warn('Failed to showNotification via service worker');
        new window.Notification(title, options);
      }
    }
  }

  static closeExiting(notifications, {tag}={}){
    if(notifications.length === 0) return;
    notifications.forEach(notification => {
      notification.tag === tag && notification.close()
    });
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