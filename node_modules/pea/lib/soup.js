/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

exports.stir = stir; // Execute peas in parallel
exports.pour = pour; // Execute peas in series (don't stop on error)
exports.spoon = spoon; // Execute peas in series (stop on first error)
exports.first = first; // Execute peas in seried until the first one is successful
exports.all = all; // Execute peas provived as individual args and map results into success args in order

var Pea = require('./pea.js');

function stir(peas) {
  var pea = Pea(function(callback) {
    if (!peas.length) return callback(null, []);
    var results = {};
    peas.forEach(function(pea, index) {
      pea.then(function() {
        results[index] = Array.prototype.slice.call(arguments);
        if (Object.keys(results).length === peas.length) {
          var err;
          var errs = [];
          var vals = [];
          Object.keys(results).sort().forEach(function(idx) {
            err = err || results[idx][0];
            errs.push(results[idx][0]);
            vals.push(results[idx].slice(1));
          });
          callback(err, err ? errs : vals);
        }
      }).resume();
    });
  });
  pea.pause = function() {
    Pea.prototype.pause.call(this);
    peas.forEach(function(pea) { pea.pause(); });
    return this;
  };
  pea.resume = function() {
    Pea.prototype.resume.call(this);
    peas.forEach(function(pea) { pea.resume(); });
    return this;
  };
  return pea;
}

function pour(peas) {
  peas.forEach(function(pea) { pea.pause(); });
  return Pea(function(callback) {
    var results = [];
    peas.forEach(function(pea, idx) {
      pea.then(function() {
        results.push(Array.prototype.slice.call(arguments));
      });
      if (peas[idx+1]) {
        pea.then(peas[idx+1]);
      } else {
        pea.then(function() {
          var err;
          var errs = [];
          var vals = [];
          var errcnt = 0;
          results.forEach(function(result) {
            err = err || result[0];
            errs.push(result[0]);
            vals.push(result.slice(1));
          });
          callback(err, err ? errs : vals);
        });
      }
    });
    peas[0] ? peas[0].resume() : callback();
  });
}

function spoon(peas) {
  peas.forEach(function(pea) { pea.pause(); });
  return Pea(function(callback) {
    var results = [];
    peas.forEach(function(pea, idx) {
      pea.success(function() {
        results.push(Array.prototype.slice.call(arguments));
      });
      if (peas[idx+1]) {
        pea.success(peas[idx+1]);
        pea.failure(callback);
      } else {
        pea.success(function() {
          callback(null, results);
        })
        pea.failure(callback);
      }
    });
    peas[0] ? peas[0].resume() : callback();
  });
}

function first(peas) {
  peas.forEach(function(pea) { pea.pause(); });
  return Pea(function(callback) {
    peas.forEach(function(pea, idx) {
      pea.success(function() {
        var args = Array.prototype.slice.call(arguments);
        callback.apply(null, [ null ].concat(args));
      });
      if (peas[idx+1]) {
        pea.failure(peas[idx+1]);
      } else {
        pea.failure(function(err) {
          callback(err);
        });
      }
    });
    peas[0] ? peas[0].resume() : callback(new Error('no peas provided'));
  });
}

function all() {
  var peas = Array.prototype.slice.call(arguments);
  return Pea(function(callback) {
    var pea = this;
    stir(peas).failure(callback).success(function(vals) {
      vals = [ null ].concat(vals.map(function(val) { return val[0]; }));
      callback.apply(pea, vals);
    });
  });
}
