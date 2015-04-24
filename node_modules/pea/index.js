/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

var Pea = require('./lib/pea.js');
var Soup = require('./lib/soup.js');
var Raw = require('./lib/raw.js');
var Series = require('./lib/series.js');

module.exports = Pea;

Pea.all = Soup.all;
Pea.map = Raw.map;
Pea.mapall = Raw.mapall;
Pea.each = Raw.each;
Pea.eachall = Raw.eachall;
Pea.any = Raw.any;
Pea.anyall = Raw.anyall;
Pea.first = Raw.first;
Pea.Soup = Soup;
Pea.series = Series;
Pea.forcedSeries = Series.forced;

Pea.bind = function(thisp, fn) {
  return function() {
    return fn.apply(thisp, Array.prototype.slice.call(arguments));
  };
};
