# Pea [![Build Status](https://secure.travis-ci.org/phidelta/pea.png)](http://travis-ci.org/#!/phidelta/pea)

**TODO:** Documentation is slightly out of date. *Needs update!*

**Pea** is basically a simple promise-like library. It's very light weight (less than 300 lines of code) and simple.

Contrary to a lot of the other promise libraries it doesn't run roughshod over the NodeJS conventions for callbacks, but works with them. At the same time it helps a bit with callback hell and makes for a much nicer code-style.

Of course this also ensures that it does not follow any ideas you might have on promises. While some may think that's a bad thing, I think that's actually good.

**Pea** let's you have the good parts of promises without all the garbage.

In concept it is very similar to *async*, but it's simpler and much cleaner to work with.

## Installation / Use

    npm install pea

## API

### Pea(fn, [arg], […])

**Arguments**

 * *fn* a node-style function whose last argument is a callback that needs to be called upon completion
 * *arg* the arguments that *fn* is called with

The constructor of a *Pea-Instance*. This executes *fn* with *arg*s. It returns a *Pea-Instance*. The *fn* function needs to call the callback, passed as the last argument appended to *args*, when it is complete. So basically *fn* can be any node-style function that follows the `callback as the last argument` convention.

#### pea.then(cb)

**Arguments**

 * *cb* a node style callback function whose first argument is an error or null if successful

This registers a callback to execute when the *Pea-Instance* is complete. Then can be called as often as necessary. Even after the *Pea-Instance* is complete. It will always call *cb* with the arguments passed to the callback by the main function.

#### pea.failure(cb) *Synonym: pea.fail(cb)*

**Arguments**

 * *cb* a node style callback function whose first argument is an error

Like *pea.then* except only if the first argument to callback exists. Of course the callback also only gets the first argument.

#### pea.success(cb) *Synonym: pea.done(cb)*

**Arguments**

 * *cb* a callback function whose arguments are the non-error arguments of the result

Like *pea.then* except only if the first argument to callback is not set. It also only gets arguments 2+.

#### pea.pause()

Pauses the execution of the *Pea-Instance* unless it has already started.

    var pea = Pea(function(callback){…});
    pea.pause();

will work. While

    var pea = Pea(function(callback){…});
    setTimeout(function() { pea.pause(); }, 0);

will not.

#### pea.resume()

Resumes a paused *Pea-Instance*.

#### pea.next(pea)
#### pea.error(fn)

### Pea.series(functions)

**Arguments**

 * *functions* an array of node-style functions

Executes a set of functions each called with the *success* result of the previous. The additional parameters of the *Pea.series* call are passed into the first function. The result is the result of the last function. (This is like *async.waterfall*)

### Pea.map(array, iterator) *Pea.mapany(array, iterator)*

**Arguments**

 * *array* an array for each item of which *iterator* is called
 * *iterator* a node-style function whose argumens are *item*, *index*, *items*, *callback* very similar to the native *Array.map*

Executes *iterator* for each item in *array*. It returns a *Pea-Instance* whose result is the array of the mapping results passed via the callback from *iterator*.

### Pea.each(array, iterator) *Pea.eachany(array, iterator)*


**Arguments**

 * *array* an array for each item of which *iterator* is called
 * *iterator* a node-style function whose argumens are *item*, *index*, *items*, *callback* very similar to the native *Array.map*

Like *Pea.map()* except that *iterator* is called for each item in *array* in series.

### Pea.any(array, iterator) *Pea.anyall(array, iterator)*

### Pea.first(array, iterator)

**Arguments**

 * *array* an array for each item of which *iterator* is called
 * *iterator* a node-style function whose argumens are *item*, *index*, *items*, *callback* very similar to the native *Array.map*

Executes *iterator* until for each item in *array* until the first one that does not return an error. If all return an error, the last error is put into the *then()* callbacks *err* argument;

### Pea.all(pea[, pea[, …]])

**Arguments**

 * *pea* a pea instance

Executes all arguments in parallel. The returned *Pea-Instance*'s *then* callback is called with the results of the arguments in order.

### Pea.Soup *the underlying functionality*

## License

Copyright (C) 2013 by Philipp Dunkel

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
