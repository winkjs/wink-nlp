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
var as = require( '../as.js' );
var allowed = require( '../allowed.js' );
var constants = require( '../constants.js' );
// Size of a single token.
var tkSize = constants.tkSize;
// Mask for preceding spaces.
var psMask = constants.psMask;

// ## colTokensOut
/**
 * Out for collection of tokens. Note: the out always returns a Javascript
 * data type or data structure.
 * @param  {number}   start       The start index of the collection.
 * @param  {number}   end         The end index of the collection.
 * @param  {object}   rdd         Raw Document Data-structure.
 * @param  {function} itsf        Desired `its` mapper.
 * @param  {function} asf         Desired `as` reducer.
 * @param  {object}   addons      The model's addons.
 * @return {*}                    Map-reduced collection of tokens.
 * @private
 */
var colTokensOut = function ( start, end, rdd, itsf, asf, addons ) {
  // Vectors require completely different handling.
  if ( itsf === its.vector ) {
    return its.vector( start, end, rdd.tokens, addons );
  }

  // Not a vector request, perform map-reduce.
  var mappedTkns = [];
  var itsfn = ( itsf && allowed.its4tokens.has( itsf ) ) ? itsf : its.value;
  var asfn = ( asf && allowed.as4tokens.has( asf ) ) ? asf : as.array;
  // Note, `as.text/markedUpText` needs special attention to include preceeding spaces.
  if ( asfn === as.text || asfn === as.markedUpText ) {
    for ( let i = start; i <= end; i += 1 ) {
      mappedTkns.push( ''.padEnd( rdd.tokens[ ( i * tkSize ) + 1 ] & psMask ), itsf( i, rdd.tokens, rdd.cache, addons ) );  // eslint-disable-line no-bitwise
    }
  } else {
    for ( let i = start; i <= end; i += 1 ) {
      mappedTkns.push( itsfn( i, rdd.tokens, rdd.cache, addons ) );
    }
  }

  return asfn( mappedTkns, rdd.markings, start, end );
}; // colTokensOut()

module.exports = colTokensOut;
