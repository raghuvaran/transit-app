export default class Notification {
  static create() {
    return (this.hasAccess() || this.requestPermission(()=>new window.Notification(...arguments))) &&
     new window.Notification(...arguments);
  }

  static hasAccess() {
    if(window.Notification.permission === "granted") return true;
    if(window.Notification.permission === "denied") return false;
    return null; // default
  }

  static requestPermission(callback){
    window.Notification.requestPermission().then(_ => this.hasAccess() && typeof callback === "function" && callback());
    return this.hasAccess();
  }
}