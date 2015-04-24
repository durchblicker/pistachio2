/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

module.exports = series;
module.exports.forced = forced;

var Pea = require('./pea.js');

function series(fns) {
  var args = Array.prototype.slice.call(arguments, 1);
  return Pea(function(callback) {
    var fn = fns.shift();
    if (!fn) return callback.apply(null, Array.prototype.slice.call(arguments, 0));
    Pea.apply(null, [fn].concat(args)).success(function() {
      var args = Array.prototype.slice.call(arguments);
      series.apply(null, [fns].concat(args)).then(callback);
    }).failure(callback);
  });
}

function forced(fns) {
  var args = Array.prototype.slice.call(arguments, 1);
  return Pea(function(callback) {
    var fn = fns.shift();
    if (!fn) return callback.apply(null, [null].concat(args.slice(1)));
    Pea.apply(null, [fn].concat(args)).then(function() {
      var args = Array.prototype.slice.call(arguments);
      forced.apply(null, [fns].concat(args)).then(callback);
    });
  });
}
