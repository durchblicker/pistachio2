#!/usr/bin/env node

/*
** © 2012 by YOUSURE Tarifvergleich GmbH. Licensed under MIT License
*/

var Path = require('path');
var Fs = require('fs');
var async = require('async');
var Package = require('./package.json');
var Program = require('commander');
var Pistachio = require(Package.main);

Program.version(Package.version);
Program.description(Package.description);
Program.option('-o, --out <file>', 'send output to file', Path.resolve);
Program.option('--strip-space', 'reduce multiple consecutive whitespaces to a single space');
Program.option('--html', 'strip spaces between > and < (Which is OK in HTML because it would be ignored anyways.)');
Program.option('-r, --render <file>', 'compile and then render using <file> as data-json', Path.resolve);
Program.command('*').action(function(template){
  var options = {
    stripSpace:!!Program.stripSpace,
    stripTagSpace:!!Program.html
  };
  async.waterfall([
    function(callback){
      Pistachio.compile(template, options, callback);
    },
    function(previousValue, callback) {
      var template = previousValue, json;
      if (Program.render) {


        async.waterfall([
          function(callback){
            Fs.readFile( Program.render, 'utf-8', callback);
          },
          function(previousValue, callback){
            try {
              json = JSON.parse(previousValue);
            } catch(err) {
              return callback(err);
            }
            callback();
          },
          function(callback){
            Pistachio.javascript( template, '<anonymous>', callback);
          },
          function(previousValue, callback){
            template = previousValue;
            callback();
          },
          function(callback){
            try {
              template = template(json);
            } catch(err) {
              return callback(err);
            }
            callback();
          },function(callback){
            if (Program.out) {
              Fs.writeFile(Program.out, template, callback);
              // Pea(Fs.writeFile, Program.out, template).then(callback);
            } else {
              process.stdout.write(template);
              callback();
            }
          }
        ],callback);


      } else {
        if (Program.out) {
          Fs.writeFile(Program.out, template, callback);
          // Pea(Fs.writeFile, Program.out, template).then(callback);
        } else {
          process.stdout.write(template);
          callback();
        }
      }
    }
  ], function (err, result) {
    if(err){
      console.error('ERROR: ', err.message);
    }
  });
});
Program.parse(process.argv);
