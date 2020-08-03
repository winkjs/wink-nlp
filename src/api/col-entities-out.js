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
var itmEntityOut = require( './itm-entity-out.js' );

// ## colEntitiesOut
/**
 * Out for collection of entities. Note: the out always returns a Javascript
 * data type or data structure. Word vectors do not apply to entities.
 * @param  {obejct}   entities entities from `rdd`; could be customEntities.
 * @param  {obejct}   rdd      Raw document data structure.
 * @param  {function} itsf     Desired `its` mapper.
 * @param  {function} asf      Desired `as` reducer.
 * @return {*}                 Reduced value.
 * @private
 */
var colEntitiesOut = function ( entities, rdd, itsf, asf ) {
  var ents = [];
  for ( let i = 0; i < entities.length; i += 1 ) {
    ents.push( itmEntityOut( i, entities, rdd, itsf ) );
  }
  // No application of allowed function if detail or span is needed, fall back to `as.array`.
  var asfn = ( allowed.as4entities.has( asf ) && itsf !== its.detail && itsf !== its.span ) ? asf : as.array;
  return asfn( ents );
}; // colEntitiesOut()

module.exports = colEntitiesOut;
