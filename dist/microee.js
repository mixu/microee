!function(e){function t(){this._events={}}t.prototype={on:function(t,n){this._events||(this._events={});var e=this._events;return(e[t]||(e[t]=[])).push(n),this},removeListener:function(s,n){var t,e=this._events[s]||[];for(t=e.length-1;t>=0&&e[t];t--)(e[t]===n||e[t].cb===n)&&e.splice(t,1)},removeAllListeners:function(t){t?this._events[t]&&(this._events[t]=[]):this._events={}},emit:function(n){this._events||(this._events={});var t,s=Array.prototype.slice.call(arguments,1),e=this._events[n]||[];for(t=e.length-1;t>=0&&e[t];t--)e[t].apply(this,s);return this},when:function(t,e){return this.once(t,e,!0)},once:function(e,n,s){function t(){s||this.removeListener(e,t),n.apply(this,arguments)&&s&&this.removeListener(e,t)}return n?(t.cb=n,this.on(e,t),this):this}},t.mixin=function(s){var e,n=t.prototype;for(e in n)n.hasOwnProperty(e)&&(s.prototype[e]=n[e])},e.exports=t,microee=e.exports}({});