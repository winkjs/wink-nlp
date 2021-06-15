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
 *
 * Computes the cosine similarity between the input bag of words (bow)
 * `a` and `b` and returns a value between 0 and 1.
 *
 * @param {object} a the first set of bows i.e word (i.e. key) and it's frequency
 * (i.e. value) pairs.
 * @param {object} b the second set of bows.
 * @return {number} cosine similarity between `a` and `b`.
 *
 * @example
 * // bow for "the dog chased the cat"
 * var a = { the: 2, dog: 1, chased: 1, cat: 1 };
 * // bow  for "the cat chased the mouse"
 * var b = { the: 2, cat: 1, chased: 1, mouse: 1 };
 * cosine( a, b );
 * // -> 0.857142857142857
 */
var bowCosineSimilarity = function ( a, b ) {
  // `ab` & `ba` additional variables are required as you dont want to corrupt
  // `a` & `b`!
  // Updated `a` with words in `b` set as 0 in `a`.
  var ab = Object.create( null );
  // Updated `b` with words in `a` set as 0 in `b`.
  var ba = Object.create( null );
  var distance;
  var w; // a word!

  // Fill up `ab` and `ba`
  for ( w in a ) { // eslint-disable-line guard-for-in
    ab[ w ] = a[ w ];
    ba[ w ] = 0;
  }
  for ( w in b ) { // eslint-disable-line guard-for-in
    ba[ w ] = b[ w ];
    ab[ w ] = ab[ w ] || 0;
  }
  // With `ab` & `ba` in hand, its easy to transform in to
  // vector: its a frequency of each word found in both strings
  // We do not need to store these vectors in arrays, instead we can perform
  // processing in the same loop.
  var sa2 = 0,  // sum of ai^2
     saxb = 0, // sum of ai x bi
     sb2 = 0,  // sum of bi^2
     va, vb;  // value of ai and bi
  // One could have used `ba`, as both have same words now!
  for ( w in ab ) { // eslint-disable-line guard-for-in
    va = ab[ w ];
    vb = ba[ w ];
    sa2 += va * va;
    sb2 += vb * vb;
    saxb += va * vb;
  }
  // Compute cosine distance; ensure you dont get `NaN i.e. 0/0` by testing for
  // `sa2` and `sb2`.
  distance = (
    ( sa2 && sb2 ) ?
      // Compute cosine if both of them are non-zero.
      ( saxb / ( Math.sqrt( sa2 ) * Math.sqrt( sb2 ) ) ) :
      // If one of them is 0 means **0 distance** otherwise a distance of **1**.
      ( !sa2 ^ !sb2 ) ? 0 : 1 // eslint-disable-line no-bitwise
  );
  return distance;
}; // bowCosineSimilarity()

// Export bowCosineSimilarity
module.exports = bowCosineSimilarity;
