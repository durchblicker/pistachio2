/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

exports.map = map;
exports.mapall = mapall
exports.any = any;
exports.anyall = anyall;
exports.each = each;
exports.eachall = eachall;
exports.first = first;

var Pea = require('./pea.js');
var Soup = require('./soup.js');

function map(items, fn) {
  var args = Array.prototype.slice.call(arguments);
  return Pea(function(callback) {
    mapall.apply(null, args).success(function(vals) {
      callback(null, vals.map(function(val) { return val[0]; }));
    }).failure(callback);
  });
}
function mapall(items, fn) {
  var args = Array.prototype.slice.call(arguments, 2);
  return Soup.stir(prepare(items, fn, args));
}

function any(items, fn) {
  var args = Array.prototype.slice.call(arguments);
  return Pea(function(callback) {
    anyall.apply(null, args).success(function(vals) {
      callback(null, vals.map(function(val) { return val[0]; }));
    }).failure(callback);
  });
}

function anyall(items, fn) {
  var args = Array.prototype.slice.call(arguments, 2);
  return Soup.pour(prepare(items, fn, args));
}

function each(items, fn) {
  var args = Array.prototype.slice.call(arguments);
  return Pea(function(callback) {
    eachall.apply(null, args).success(function(vals) {
      callback(null, vals.map(function(val) { return val[0]; }));
    }).failure(callback);
  });
}
function eachall(items, fn) {
  var args = Array.prototype.slice.call(arguments, 2);
  return Soup.spoon(prepare(items, fn, args));
}

function first(items, fn) {
  var args = Array.prototype.slice.call(arguments, 2);
  return Soup.first(prepare(items, fn, args));
}

function prepare(items, fn, args) {
  var cutoff = 0;
  switch(fn.length - args.length) {
    case 2: cutoff = -3; break;
    case 3: cutoff = -2; break;
    case 4: cutoff = -1; break;
    default: throw(new Error('invalid iterator'));
  }
  return items.map(function(item) {
    var callargs = [ item ].concat(args.concat(Array.prototype.slice.call(arguments, 0, cutoff)));
    return Pea(bind(fn, items, callargs));
  });
}

function bind(fn, thisp, args) {
  args = args || [];
  thisp = thisp || null;
  return function() {
    return fn.apply(thisp || this, args.concat(Array.prototype.slice.call(arguments)));
  };
}
