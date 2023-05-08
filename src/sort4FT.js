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

/**
 * Stable sort function for frequency table i.e. `[ [ term, frequency ] ... ]`.
 * It first sorts on the frequency and then an alpha-numeric sort on term.
 *
 * @param  {array}  a first term-frequency pair element sent by sort.
 * @param  {array}  b second term-frequency pair element sent by sort.
 * @return {number}   number: -1 or 0 or +1.
 */
module.exports = ( a, b ) => {
  if ( b[ 1 ] > a[ 1 ] ) {
    return 1;
  } else if ( b[ 1 ] < a[ 1 ] ) {
           return -1;
         } else if ( a[ 0 ] > b[ 0 ] ) return 1;
  return -1;
};
