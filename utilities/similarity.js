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

var similarity = Object.create( null );
similarity.bow = Object.create( null );
similarity.set = Object.create( null );
similarity.vector = Object.create( null );

/**
 *
 * Computes the cosine similarity between the input bag of words (bow)
 * `bowA` and `bowB` and returns a value between 0 and 1.
 *
 * @param {object} bowA the first bow i.e word (i.e. key) and it's frequency
 * (i.e. value) pairs.
 * @param {object} bowB the second bow.
 * @return {number} cosine similarity between `bowA` and `bowB`.
 */
similarity.bow.cosine = function ( bowA, bowB ) {
  // `ab` & `ba` additional variables are required as you dont want to corrupt
  // `bowA` & `bowB`!
  // Updated `a` with words in `b` set as 0 in `a`.
  var ab = Object.create( null );
  // Updated `b` with words in `a` set as 0 in `b`.
  var ba = Object.create( null );
  // Similarly score.
  var ss;
  var w; // a word!

  // Fill up `ab` and `ba`
  for ( w in bowA ) { // eslint-disable-line guard-for-in
    ab[ w ] = bowA[ w ];
    ba[ w ] = 0;
  }
  for ( w in bowB ) { // eslint-disable-line guard-for-in
    ba[ w ] = bowB[ w ];
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
  // Compute cosine similarity; ensure you dont get `NaN i.e. 0/0` by testing for
  // `sa2` and `sb2`.
  ss = (
    ( sa2 && sb2 ) ?
      // Compute cosine if both of them are non-zero.
      +( saxb / ( Math.sqrt( sa2 ) * Math.sqrt( sb2 ) ) ).toFixed( 6 ) :
      // If one of them is 0 means **0** ss otherwise a ss of **1**.
      ( !sa2 ^ !sb2 ) ? 0 : 1 // eslint-disable-line no-bitwise
  );
  return ss;
}; // similarity.bow.cosine()

// ### tversky
/**
 *
 * Computes the tversky similarity between input sets `setA` and `setB`.
 * This similarity is always between 0 and 1. Tversky calls `setA` as
 * **prototype** and `setB` as **variant**. The `alpha` corresponds
 * to the weight of prototype, whereas `beta` corresponds to the
 * weight of variant.
 *
 * @param {set} setA the first set or the prototype.
 * @param {set} setB the second set or the variant.
 * @param {number} [alpha=0.5] the prototype weight.
 * @param {number} [beta=0.5] the variant weight.
 * @return {number} the tversky similarity between `setA` and `setB`.
 */
similarity.set.tversky = function ( setA, setB, alpha, beta ) {
  // Early return.
  if ( setA.size === 0 && setB.size === 0 ) return 1;
  if ( setA.size === 0 || setB.size === 0 ) return 0;

  // Contains `alpha` & `beta` values respectively after the validations.
  var a, b;
  // Size of the intersection between set `setA` and `setB`.
  var intersectSize = 0;
  // Their differences!
  var saDIFFsb, sbDIFFsa;
  // The similarity score between `setA` and `setB`.
  var ss;
  a = ( isNaN( alpha ) ) ? 0.5 : +alpha;
  b = ( isNaN( beta ) ) ? 0.5 : +beta;
  if ( a < 0 || b < 0 ) {
    throw Error( 'wink-nlp: tversky requires aplha & beta to be positive numbers.' );
  }
  // Use smaller sized set for iteration.
  if ( setA.size < setB.size ) {
  setA.forEach( function ( element ) {
    if ( setB.has( element ) ) intersectSize += 1;
  } );
  } else {
    setB.forEach( function ( element ) {
      if ( setA.has( element ) ) intersectSize += 1;
    } );
  }
  saDIFFsb = setA.size - intersectSize;
  sbDIFFsa = setB.size - intersectSize;
  // Compute Tversky similarity.
  ss = ( intersectSize / ( intersectSize + ( a * saDIFFsb ) + ( b * sbDIFFsa ) ) );
  return +ss.toFixed( 6 );
}; // tversky()


// ### oo
/**
 *
 * Computes the Otsuka-Ochiai similarity between input sets `setA` and `setB`.
 * This similarity is always between 0 and 1. It is equivalent to binary bow
 * cosine similarity.
 *
 * @param {set} setA the first set.
 * @param {set} setB the second set.
 * @return {number} the oo similarity between `setA` and `setB`.
 */
similarity.set.oo = function ( setA, setB ) {
  // Early return.
  if ( setA.size === 0 && setB.size === 0 ) return 1;
  if ( setA.size === 0 || setB.size === 0 ) return 0;

  // Size of the intersection between set `setA` and `setB`.
  var intersectSize = 0;

  // Use smaller sized set for iteration.
  if ( setA.size < setB.size ) {
  setA.forEach( function ( element ) {
    if ( setB.has( element ) ) intersectSize += 1;
  } );
  } else {
    setB.forEach( function ( element ) {
      if ( setA.has( element ) ) intersectSize += 1;
    } );
  }

  return +( intersectSize / ( Math.sqrt( setA.size * setB.size ) ) ).toFixed( 6 );

}; // similarity.set.oo()

/**
 *
 * Computes the cosine similarity between the input vectors
 * `vectorA` and `vectorB` and returns a value between 0 and 1.
 * Note, in winkNLP all vectors contain the `l2Norm` as the last
 * element of the array.
 *
 * @param {object} vectorA the first vector
 * @param {object} vectorB the second vector.
 * @return {number} cosine similarity between `vectorA` and `vectorB`.
 */
similarity.vector.cosine = function ( vectorA, vectorB ) {
  let sumOfProducts = 0;
  // Recall, the last element is always the `l2Norm`.
  const length = vectorA.length - 1;

  for ( let i = 0; i < length; i += 1 ) {
    sumOfProducts += vectorA[ i ] * vectorB[ i ];
  }

  // Use `l2Norm` directly from each vector.
  return +( sumOfProducts / ( vectorA[ length ] * vectorB[ length ] ) ).toFixed( 6 );
}; // similarity.vector.cosine()

// Export similarity
module.exports = similarity;
