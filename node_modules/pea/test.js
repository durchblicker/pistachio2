/*
** © 2013 by Philipp Dunkel <p.dunkel@me.com>. Licensed under MIT License.
*/

var fs = require('fs');
var Pea = require('./index.js');

var files = [__filename, __dirname + '/package.json', __dirname + '/Readme.md'];

function run(file, callback) {
  //console.error('Fetching: '+file);
  setTimeout(function() {
    fs.readFile(file, 'utf-8', callback);
  }, 20);
}

Pea(run, files[0]).next(Pea(function(callback) {
  console.error('Test 1 (single): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.map(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 2 (map): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.mapall(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 2a (mapall): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.each(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 3 (each): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.eachall(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 3a (eachall): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.any(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 4 (any): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.anyall(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 4a (anyall): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]));
  Pea.first(files, run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 5 (first): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]), this.previousValue.substr(0, 25).split(/\r?\n/).join('\\n'));
  Pea.first([__dirname].concat(files), run).then(callback);
})).next(Pea(function(callback) {
  console.error('Test 5a (first-fail-one): ', typeof this.previousValue, Array.isArray(this.previousValue), typeof this.previousValue[0], Array.isArray(this.previousValue[0]), this.previousValue.substr(0, 25).split(/\r?\n/).join('\\n'));
  callback();
})).success(function() {
  console.error('SUCCESS');
}).error(function(err) {
  console.error('FAILURE');
  process.exit(1);
});
