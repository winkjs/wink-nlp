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

// ## itmDocumentOut
/**
 * Out method for the document. Note: the out always returns a Javascript
 * data type or data structure.
 * @param  {Object}   rdd         Raw Document Data-structure.
 * @param  {function} itsf        Desired `its` mapper.
 * @param  {Object}   addons      The model's addons.
 * @return {*}                    Mapped value.
 * @private
 */
var itmDocumentOut = function ( rdd, itsf, addons ) {
  var document = rdd.document;
  // Vectors require completely different handling.
  if ( itsf === its.vector ) {
    return its.vector( document, rdd, addons );
  }

  var itsfn = ( itsf && allowed.its4document.has( itsf ) ) ? itsf : its.value;

  if ( itsfn === its.span || itsfn === its.sentiment ) {
    return itsfn( document );
  }

  // Handle its.negationFlag seprately here.
  if ( itsfn === its.negationFlag ) {
    return ( document[ 2 ] === 1 );
  }

  if ( itsfn === its.readabilityStats ) {
    return itsfn( rdd, addons );
  }

  if ( itsfn === its.sentenceWiseImportance ) {
    return itsfn( rdd );
  }

  // Setup the correct `as.fn` becuase the current markedup text would have
  // returned the `value`. Refer to `its.markedUpText`.
  var asfn = ( itsfn === its.markedUpText ) ? as.markedUpText : as.text;

  return colTokensOut( document[ 0 ], document[ 1 ], rdd, itsfn, asfn, addons );
}; // itmDocumentOut()

module.exports = itmDocumentOut;
