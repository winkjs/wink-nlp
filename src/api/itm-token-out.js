//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions:
//
//     The above copyright notice and this permission notice
//     shall be included in all copies or substantial
//     portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//     ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//     TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//     PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
//     CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//     CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//

var its = require( '../its.js' );
var allowed = require( '../allowed.js' );

// ## itmTokenOut
/**
 * Out method for a token. Note: the out always returns a Javascript
 * data type or data structure.
 * @param  {number}   index       The index of desired token.
 * @param  {Object}   rdd         Raw Document Data-structure.
 * @param  {function} itsf        Desired `its` mapper.
 * @param  {object}   addons      The model's addons.
 * @return {*}                    Mapped value.
 * @private
 */
var itmTokenOut = function ( index, rdd, itsf, addons ) {
  // Vectors require completely different handling.
  if ( itsf === its.vector ) {
    return its.vector( index, rdd, addons );
  }
  // Not a vector request, map using `itsf`.
  var f = ( allowed.its4token.has( itsf ) ) ? itsf : its.value;
  return f( index, rdd.tokens, rdd.cache, addons );
}; // itmTokenOut()

module.exports = itmTokenOut;
