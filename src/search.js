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

// ## search
/**
 *
 * Searches the `token`'s index in the `spans` and returns the index of the
 * span, where it is found.
 *
 * @param {number} token to be searched.
 * @param {array[]} spans where token will be searched.
 * @return {number} index of span where token is found; if it is not found then
 * it returns `null`.
 * @private
*/
var search = function ( token, spans ) {
  var minIndex = 0;
  var maxIndex = spans.length - 1;
  var currIndex;
  var leftToken;
  var rightToken;

  while ( minIndex <= maxIndex ) {
    currIndex = ( minIndex + maxIndex ) / 2 | 0; // eslint-disable-line no-bitwise
    leftToken = spans[ currIndex ][ 0 ];
    rightToken = spans[ currIndex ][ 1 ];

    if ( token > rightToken ) {
      minIndex = currIndex + 1;
    } else if ( token < leftToken ) {
      maxIndex = currIndex - 1;
    } else return currIndex;
  }

  return null;
}; // search()

module.exports = search;
