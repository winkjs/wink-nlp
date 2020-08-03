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

var locate = require( './locate.js' );

// ## containedMarkings
/**
 *
 * Returns the range of contained markings, if any within the span defined by the
 * `start` and the `end`.
 *
 * @param {array} markings from where contained ones will be returned, if any.
 * @param {number} start The start of the span.
 * @param {number} end The end of the span.
 * @return {array} range of contained markings, `null` if none are contained.
 * @private
*/
var containedMarkings = function ( markings, start, end ) {
  if ( markings === undefined || start === undefined || end === undefined ) {
    return null;
  }

  // Left & right indexes into the `markings` array.
  var left = locate( start, markings );
  var right = locate( end, markings );
  var maxIndex = markings.length - 1;
  var kl, kr;

  // Return just the text if span is completely on the left or right side of the
  // `markings`.
  if ( ( left < 0 && right < 0 ) || ( left > maxIndex && right > maxIndex ) ) {
    return null;
  }

  // The `left` must move to the next integer value to get the first index.
  // To avoid `-0`!
  kl = ( left < 0 ) ? 0 : Math.ceil( left );

  // If both `left` and `right` are fractions & equal means nothing is contained.
  // Return just the text, no markups!
  if ( ( left === right ) && ( kl !== left ) ) {
    return null;
  }

  kr = Math.floor( right );
  // Mark those markings, which are completely contained in the closed interval
  // `[ start, end ]` i.e. no partially contained markings.
  if ( markings[ kl ][ 0 ] < start ) kl += 1;
  if ( markings[ kr ][ 1 ] > end )   kr -= 1;
  if ( kl > kr ) {
    return null;
  }

  var range = Object.create( null );
  range.left = kl;
  range.right = kr;

  return range;
}; // containedMarkings

module.exports = containedMarkings;
