/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

module.exports = Pea;

var next = ('function' === typeof setImmediate) ? setImmediate : ((('object' === typeof process) && ('function' === typeof process.nextTick)) ? process.nextTick : function(fn) { setTimeout(fn, 0); });
var secret = Math.round(Math.random() * 1e9).toString(16);

function Pea(fn) {
  if (!(this instanceof Pea)) return Pea.apply(new Pea(), Array.prototype.slice.call(arguments));
  this.exec = this.exec || (fn ? bind(fn, this) : null);
  this.args = Array.prototype.slice.call(arguments, 1);
  this.chain = [this];
  this.paused = this.paused || null;
  this.result = this.result || null;
  this.handle = this.handle || [];
  this.previousError = this.previousError || null;
  this.previousValue = this.previousValue || null;
  this.waiting = this.waiting || false;
  fn ? this.resume() : this;
  return this;
}
function bind(fn, thisp, args) {
  args = args || [];
  thisp = thisp || null;
  return function() {
    return fn.apply(thisp || this, args.concat(Array.prototype.slice.call(arguments)));
  };
}
function exec(pea) {
  //console.error('EXEC: ', pea);
  pea.waiting = false;
  if (!pea.exec) return;
  pea.exec.apply(pea, pea.args.concat([callback]));
  pea.exec = pea.paused = null;
  function callback(err) {
    pea.result = Array.prototype.slice.call(arguments, 0);
    var handlers = pea.handle;
    pea.handle = [];
    handlers.forEach(function(handler) {
      //console.error('CALLLBACK');
      handler.apply(pea, pea.result);
    });
  }
}

Pea.prototype.pause = function() {
  this.paused = this.paused || this.exec;
  this.exec = null;
  return this;
};
Pea.prototype.resume = function() {
  this.exec = this.exec || this.paused;
  this.paused = null;
  if (!this.waiting && this.exec) {
    this.waiting = true;
    next(bind(exec, this, [ this ]));
  }
  return this;
};
Pea.prototype.then = function(callback) {
  var that = this;
  if (callback instanceof Pea) {
    var pea = callback.pause();
    callback = function(err, val) {
      console.error(err ? 'Failure: ' : 'Success: ',err);
      pea.previousError = err;
      pea.previousValue = val;
      pea.resume();
    };
    this.result ? callback.apply(this, this.result) : this.handle.push(callback);
    return pea;
  }
  next(function() {
    that.result ? callback.apply(that, that.result) : that.handle.push(function(err) {
      //console.error(err ? 'Failure: ' : 'Success: ',err);
      callback.apply(null, Array.prototype.slice.call(arguments));
    });
    //console.error('HANDLERS ', that, that.handle);
  });
  return this;
};
Pea.prototype.success = function(callback) {
  var that = this;
  var cb;
  if (callback instanceof Pea) {
    var pea = callback.pause();
    this.then(function(err, val) {
      if (err) return;
      pea.previousError = err;
      pea.previousValue = val;
      pea.resume();
    });
    return pea;
  }
  return this.then(function(err, val) {
    if (err) return;
    callback.apply(that, Array.prototype.slice.call(arguments, 1));
  });
};
Pea.prototype.done = Pea.prototype.success;
Pea.prototype.failure = function(callback, pass) {
  if ((this.chain.length > 1) && (pass!=secret)) throw(new Error('chains must use error()'));
  var that = this;
  var cb;
  if (callback instanceof Pea) {
    var pea = callback.pause();
    this.then(function(err, val) {
      if (!err) return;
      pea.previousError = err;
      pea.previousValue = val;
      pea.resume();
    });
    return pea;
  }
  return this.then(function(err, val) {
    if (!err) return;
    callback.apply(that, Array.prototype.slice.call(arguments));
  });
};
Pea.prototype.fail = Pea.prototype.failure;
Pea.prototype.next = function(pea) {
  if ('function' === typeof pea) return this.next(Pea(pea));
  if (!(pea instanceof Pea)) throw(new Error('you can only next to a Pea'));
  pea.chain = this.chain;
  pea.chain.push(pea);
  pea.pause();
  return this.success(pea);
};
Pea.prototype.pass = function(pea) {
  if ('function' === typeof pea) return this.pass(Pea(pea));
  if (!(pea instanceof Pea)) throw(new Error('you can only pass to a Pea'));
  pea.chain = this.chain;
  pea.chain.push(pea);
  pea.pause();
  return this.done(function() {
    pea.previousError = err;
    pea.previousValue = val;
    pea.args = pea.args.concat(Array.prototype.slice.call(arguments));
    pea.resume();
  });
};
Pea.prototype.error = function(pea) {
  if ('function' === typeof pea) return this.error(Pea(pea));
  if (!(pea instanceof Pea)) throw(new Error('you can only error to a Pea'));
  this.chain.forEach(function(chain) {
    chain.fail(pea, secret);
  });
};
