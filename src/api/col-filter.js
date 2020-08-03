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

// ## colFilter
/**
 * Filter for collections.
 * @param  {function} f             Predicate function to test each item of
 *                                  the array. Return true to select the item,
 *                                  false to reject or exclude.
 * @param  {number}   start         The start index.
 * @param  {number}   end           The end index.
 * @param  {function} itemFn        Item function to create chainable-methods of the item.
 * @param  {function} colSelectedFn The function to create chainable-methods for
 *                                  the collection of selection, which are returned.
 * @return {object}                 Object containing the applicable chainable-methods.
 */
var colFilter = function ( f, start, end, itemFn, colSelectedFn ) {
  var filtered = [];
  for ( let k = start; k <= end; k += 1 ) {
    // Use relative indexing by adding `start` from `k`.
    if ( f( itemFn( k ), ( k - start ) ) ) filtered.push( k );
  }
  return colSelectedFn( filtered );
}; // colFilter()

module.exports = colFilter;
