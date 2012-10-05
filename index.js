function M() { this._events = {}; };
M.prototype = {
  on: function(ev, cb) {
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function(ev, cb) {
    var e = this._events[ev] || [], i;
    for(i = e.length-1; i >= 0 && e[i]; i--){
      if(e[i] === cb || e[i].cb === cb) { e.splice(i, 1) };
    }
  },
  removeAllListeners: function(ev) {
    if(!ev) { this._events = {}; }
    else { this._events[ev] && (this._events[ev] = []); }
  },
  emit: function(ev) {
    var args = Array.prototype.slice.call(arguments, 1), i,
        e = this._events[ev] || [];
    for(i = e.length-1; i >= 0 && e[i]; i--){
      e[i].apply(this, args);
    }
    return this;
  },
  when: function(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function(ev, cb, when) {
    var c = (when ? w : o);
    function w() { cb && cb.apply(this, arguments) && this.removeListener(ev, c); }
    function o() { cb && cb.apply(this, arguments); this.removeListener(ev, c); }
    c.cb = cb;
    this.on(ev, c);
    return this;
  },
  mixin: function(dest) {
    var o = M.prototype;
    for (var k in o) {
      o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
    }
  }
};

module.exports = M;
