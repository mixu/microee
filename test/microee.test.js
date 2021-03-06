var assert = require('assert'),
    MiniEventEmitter = require('../index.js');

// set and emit an event using a string

var ee;
exports['given a microee'] = {

  beforeEach: function(done) {
    ee = new MiniEventEmitter();
    done();
  },

  afterEach: function(done) {
    done();
  },

  'should be able to set a listener using a string': function(done) {
    ee.on('test', function(arg) { assert.ok(arg === 'success'); done(); } );
    ee.emit('test', 'success');
  },

  'listeners set using once should only fire once': function(done) {
    var assertions = 0;
    ee.once(/test.*/, function(arg) {
      if(arg === 'success') {
        assert.ok(true);
        assertions++;
      }
      if(arg == 'final') {
        assert.ok(false);
        assertions++;
      }
    });
    ee.emit('testing', 'success');
    ee.emit('test', 'final');
    done();
  },

  'can set multiple listeners with the same string': function() {
    var assertions = 0;
    ee.on('test', function(arg) { assert.ok(arg === 'success'); assertions++; } );
    ee.on('test', function(arg) { assert.ok(arg === 'success'); assertions++; } );
    ee.emit('test', 'success');
    assert.equal(2, assertions);
  },

  'can use listeners()': function() {
    // is array when empty
    assert.ok(Array.isArray(ee.listeners('test')));
    ee.on('test', function() { } );
    ee.on('test', function() { } );
    // is array on unrelated
    assert.ok(Array.isArray(ee.listeners('test2')));
    assert.ok(Array.isArray(ee.listeners('test')));
    assert.equal(ee.listeners('test').length, 2);
  },

  'can pass an arbitrary number of arguments on events': function(done) {
    ee.on('test', function(a, b, c, d, e, f, g, h) {
      assert.equal(a, 'as');
      assert.equal(b, 'easy');
      assert.equal(c, 'as');
      assert.equal(d, '1');
      assert.equal(e, '2');
      assert.equal(f, '3');
      assert.equal(g, 'it');
      assert.equal(h, 'works');
      done();
    });
    ee.emit('test', 'as', 'easy', 'as', '1', '2', '3', 'it', 'works');
  },

  'setting more than one once() will still trigger all events': function() {
    var assertions = 0;
    ee.once('aaaa', function(arg) { assert.ok(arg === 'success'); assertions++; } );
    ee.on('aaaa', function(arg) { assert.ok(arg === 'success'); assertions++; } );
    ee.once('aaaa', function(arg) { assert.ok(arg === 'success'); assertions++; });
    ee.emit('aaaa', 'success');
    assert.equal(3, assertions);
  },

  'a when callback is only removed when it returns true': function(done) {
    var items = [];
    ee.when('aaaa', function(message) {
      items.push(message);
      return (items.length > 2);
    });
    ee.emit('aaaa', 1);
    ee.emit('aaaa', 2);
    ee.emit('aaaa', 3);
    ee.emit('aaaa', 4);

    assert.ok(items.some(function(message) {return message == 1;}));
    assert.ok(items.some(function(message) {return message == 2;}));
    assert.ok(items.some(function(message) {return message == 3;}));
    assert.ok(!items.some(function(message) {return message == 4;}));
    assert.equal(3, items.length);
    done();
  },

  'can remove a single callback by string, even ones set by once': function(done) {
    var fail = function fail() { assert.ok(false); };
    ee.on('tickets:21', fail);
    ee.once('tickets:21', fail);
    ee.removeListener('tickets:21', fail);
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      assert.ok(true);
      done();
    }, 10);
  },

  'can remove all listeners from an event by string': function(done) {
    var fail = function() { assert.ok(false); };
    ee.on('tickets:21', fail);
    ee.once('tickets:21', fail);
    ee.removeAllListeners('tickets:21');
    ee.emit('tickets:21', 'data');
    setTimeout(function() {
      done();
    }, 10);
  },

  'once() should remove the listener before running the callback, not after': function(done) {
    ee.once('ready', function() {
      console.log('called 1');
      ee.once('ready', function() {
        console.log('called 2');
        done();
      });
      ee.emit('ready');
    });
    ee.emit('ready');
  }

};


// if this module is the script being run, then run the tests:
if (module == require.main) {
  var mocha = require('child_process').spawn('mocha', [ '--colors', '--ui', 'exports', '--reporter', 'spec', __filename ]);
  mocha.stdout.pipe(process.stdout);
  mocha.stderr.pipe(process.stderr);
}
