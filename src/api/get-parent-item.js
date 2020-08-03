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

var search = require( '../search.js' );

// ## getParentItem
/**
 * Obtains the parent of the required item from a parent collection of spans.
 * @param  {number}   currItemIndex    Index of the item whose parent is needed.
 * @param  {array[]}  parentCollection Parent collection of spans.
 * @param  {function} parentItemFn     Required to instantiate the found parent item.
 * @return {object}                    Object containing the applicable chainable-methods
 *                                     of parent item, if found; otherwise `undefined`.
 * @private
 */
var getParentItem = function ( currItemIndex, parentCollection, parentItemFn ) {
  var k = search( currItemIndex, parentCollection );
  if ( k === null ) return undefined;
  return parentItemFn( k );
}; // getParentItem()

module.exports = getParentItem;
