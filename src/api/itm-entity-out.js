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

// ## itmEntityOut
/**
 * Out method for an entity. Note: the out always returns a Javascript
 * data type or data structure. There is no word vector support for entity.
 * @param  {number}   index       The index of desired entity.
 * @param  {Object}   entities    The entities from the `rdd`; could be custom.
 * @param  {Object}   rdd         Raw Document Data-structure.
 * @param  {function} itsf        Desired `its` mapper.
 * @return {*}                    Mapped value.
 * @private
 */
var itmEntityOut = function ( index, entities, rdd, itsf ) {
  var entity = entities[ index ];
  var itsfn = ( itsf && allowed.its4entity.has( itsf ) ) ? itsf : its.value;
  var detail;

  if ( itsfn === its.detail ) {
    // In case of `detail`, return an object containing entity's `text` & `type`.
    detail = Object.create( null );
    detail.value = colTokensOut( entity[ 0 ], entity[ 1 ], rdd, its.value, as.text );
    detail.type = entity[ 2 ];
    return detail;
  }

  if ( itsfn === its.type ) {
    // Extract `type` and return directly.
    return entity[ 2 ];
  }

  if ( itsfn === its.span ) {
    // Extract span and return.
    return its.span( entity );
  }

  // Balance cases ( i.e. value, normal, and type ) are handled via `colTokensOut()`.
  return colTokensOut( entity[ 0 ], entity[ 1 ], rdd, itsfn, as.text );
}; // itmEntityOut()

module.exports = itmEntityOut;
