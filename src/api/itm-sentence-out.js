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
var colTokensOut = require( './col-tokens-out.js' );

// ## itmSentenceOut
/**
 * Out method for a sentence. Note: the out always returns a Javascript
 * data type or data structure.
 * @param  {number}   index       The index of desired sentence.
 * @param  {Object}   rdd         Raw Document Data-structure.
 * @param  {function} itsf        Desired `its` mapper.
 * @param  {object}   addons      The model's addons.
 * @return {*}                    Mapped value.
 * @private
 */
var itmSentenceOut = function ( index, rdd, itsf, addons ) {
  var sentence = rdd.sentences[ index ];

  var itsfn = ( itsf && allowed.its4sentence.has( itsf ) ) ? itsf : its.value;

  if ( itsfn === its.span || itsfn === its.sentiment ) {
    return itsfn( sentence );
  }

  // Handle `its.negationFlag` seprately here.
  if ( itsfn === its.negationFlag ) {
    return ( sentence[ 2 ] === 1 );
  }

  // Setup the correct `as.fn` becuase the current markedup text would have
  // returned the `value`. Refer to `its.markedUpText`.
  var asfn = ( itsfn === its.markedUpText ) ? as.markedUpText : as.text;

  return colTokensOut( sentence[ 0 ], sentence[ 1 ], rdd, itsfn, asfn, addons );
}; // itmSentenceOut()

module.exports = itmSentenceOut;
