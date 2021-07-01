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

var sort4FT = require( './sort4FT.js' );
var containedMarkings = require( './contained-markings.js' );
var as = Object.create( null );

// ### array
/**
 * It is a simple passthru function i.e. input is returned as-is.
 *
 * @param  {string[]} tokens The input tokens.
 * @return {string[]}        the input `tokens` as-is.
 * @private
 */
as.array = function ( tokens ) {
  // Return the input tokens as-is.
  return tokens;
}; // array()

// ### set
/**
 * Constructs set from the `tokens`.
 *
 * @param  {string[]} tokens The input tokens.
 * @return {set}      the set of `tokens`.
 * @private
 */
as.set = function ( tokens ) {
  // Create set & return.
  return new Set( tokens );
}; // set()

// ### bow
/**
 *
 * Constructs the bag of words from the `tokens`.
 *
 * @param  {string[]} tokens The input tokens.
 * @return {objects}         the bag of words object containing `token/frequency`
 *                           `key/value` pairs.
 * @private
 */
as.bow = function ( tokens ) {
  // Bag of words.
  var bow = Object.create( null );
  var t;
  for ( let i = 0; i < tokens.length; i += 1 ) {
    t = tokens[ i ];
    bow[ t ] = 1 + ( bow[ t ] || 0 );
  }

  return bow;
}; // bow()

// ### freqTable
/**
 * Constructs the frequency table of `tokens`, which sorted in a descending
 * order of token's frequency.
 *
 * @param  {string[]} tokens The input tokens.
 * @return {array[]}         array of `[ token, frequency ]` pairs.
 * @private
 */
as.freqTable = function ( tokens ) {
  // NOTE: build FT based on argument type i.e. array or object (its.detail)
  var bow = as.bow( tokens );
  var keys = Object.keys( bow );
  var length = keys.length;
  var table = new Array( length );

  for ( var i = 0; i < length; i += 1 ) {
    table[ i ] = [ keys[ i ], bow[ keys[ i ] ] ];
  }

  return table.sort( sort4FT );
}; // freqTable()

// ### bigrams
/**
 * Generates bigrams of the input tokens.
 *
 * @param  {string[]} tokens The input tokens.
 * @return {array[]}         array of `[ token`<sub>i</sub>`, token`<sub>i+1</sub> `  ]`
 *                           bigrams.
 * @private
 */
as.bigrams = function ( tokens ) {
  // Bigrams will be stored here.
  var bgs = [];
  // Helper variables.
  var i, imax;
  // Create bigrams.
  for ( i = 0, imax = tokens.length - 1; i < imax; i += 1 ) {
    bgs.push( [ tokens[ i ], tokens[ i + 1 ] ] );
  }
  return bgs;
}; // bigrams()

as.unique = function ( tokens ) {
  return Array.from( new Set( tokens ) );
}; // unique()

// ### text
/**
 *
 * Generates the text by joining the contents of `twps` array (tokens with
 * preceding spaces).
 *
 * @param  {array} twps Array containing tokens with preceding spaces.
 * @return {string}     the text.
 * @private
*/
as.text = function ( twps ) {
  // Join on empty-space as preceding spaces are part of `twps`!
  return twps.join( '' ).trim();
}; // text()

// ### markedUpText
/**
 *
 * Generates the marked up text of the span specified by the `start` and `end` using
 * `twps` and `markings`.
 *
 * @param  {array}  twps     Array containing tokens with preceding spaces.
 * @param  {array}  markings Array containing span of markings & marking specs.
 * @param  {number} start    The start index of the tokens.
 * @param  {number} end      The end index of the tokens.
 * @return {string}          the markedup text.
 * @private
*/
as.markedUpText = function ( twps, markings, start, end ) {
  // Offset to be added while computing `first` and `last` indexes of `twps`.
  var offset = start * 2;
  // Compute the `range` of `markings` to consider on the basis `start` and `end`.
  var range = containedMarkings( markings, start, end );
  if ( range === null ) {
    // Means no valid range, return the text as is.
    return twps.join( '' ).trim();
  }
  // For every marking prefix the `first` one with `beginMarker` and suffix
  // the `last` one with `endMarker`.
  for ( let i = range.left; i <= range.right; i += 1 ) {
    const first = ( ( markings[ i ][ 0 ] * 2 ) - offset ) + 1;
    const last  = ( ( markings[ i ][ 1 ] * 2 ) - offset ) + 1;
    const beginMarker = ( markings[ i ][ 2 ]  === undefined ) ? '<mark>' : markings[ i ][ 2 ];
    const endMarker = ( markings[ i ][ 3 ]  === undefined ) ? '</mark>' : markings[ i ][ 3 ];

    twps[ first ] = beginMarker + twps[ first ];
    twps[ last ] += endMarker;
  }

  // Join all the elements and return the `markedUpText`.
  return twps.join( '' ).trim();
}; // markedUpText()

module.exports = as;
