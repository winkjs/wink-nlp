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

// ## containedEntities
/**
 *
 * Returns the contained entities, if any within the span defined by the
 * `sentenceStart` and the `sentenceEnd`.
 *
 * @param {array} entities from where contained ones will be returned, if any.
 * @param {number} sentenceStart start of the sentence.
 * @param {number} sentenceEnd end of the sentence.
 * @return {array} of contained entities, empty if none are contained.
 * @private
*/
var containedEntities = function ( entities, sentenceStart, sentenceEnd ) {
  var left = locate( sentenceStart, entities );
  var right = locate( sentenceEnd, entities );
  var maxIndex = entities.length - 1;
  // Contained entities.
  var contained = [];
  // Index left & right.
  var kl, kr;
  // Helper.
  var i;

  // Return empty array if span is completely on the left or right side of the
  // `entities`.
  if ( ( left < 0 && right < 0 ) || ( left > maxIndex && right > maxIndex ) ) {
    return contained;
  }

  // The `left` must move to the next integer value to get the first index.
  // To avoid `-0`!
  kl = ( left < 0 ) ? 0 : Math.ceil( left );

  // If both `left` and `right` are fractions & equal means nothing is contained.
  if ( ( left === right ) && ( kl !== left ) ) {
    return contained;
  }

  // Something is conatined for sure, capture it and return!
  kr = Math.floor( right );
  for ( i = kl; i <= kr; i += 1 ) {
    contained.push( i );
  }

  return contained;
}; // containedEntities()

module.exports = containedEntities;
