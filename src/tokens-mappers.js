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

var constants = require( './constants.js' );
// Size of a single token.
var tkSize = constants.tkSize;
// Bits reserved for `lemma`.
var bits4lemma = constants.bits4lemma;
// Mask for extracting pos
var posMask = constants.posMask;

var mappers = Object.create( null );

// ## mapRawTokens2UIDn
/**
 * Maps the raw tokens to an array of uid of normal of tokens.
 * @private
 *
 * @param {object} rdd The raw document data-structure.
 * @returns {array} conatining the uid of normals.
 * @private
*/
var mapRawTokens2UIdOfNormal = function ( rdd ) {
  // Extract tokens & cache.
  var tokens = rdd.tokens;
  var cache = rdd.cache;
  // Will contain only the hash of normal of tokenized lexemes.
  var mappedTokens = new Array( rdd.numOfTokens );
  var i, k;
  for ( i = 0; i < tokens.length; i += tkSize ) {
    k = i + 1;
    mappedTokens[ i / tkSize ] = ( tokens[ k ] > 65535 ) ?
                              // Handle contraction's expansion.
                              cache.nox( tokens[ k ] ) :
                              // Handle all other words.
                              cache.normal( tokens[ i ] );
  } // for ( i = 0; i < tokens.length...

  return mappedTokens;
}; // mapRawTokens2UIdOfNormal()

// ## mapRawTokens2UIDn
/**
 * Maps the raw tokens to an array of uid of value of tokens.
 * @private
 *
 * @param {object} rdd The raw document data-structure.
 * @returns {array} conatining the uid of values.
 * @private
*/
var mapRawTokens2UIdOfValue = function ( rdd ) {
  // Extract tokens.
  var tokens = rdd.tokens;
  var cache = rdd.cache;
  // Will contain only the hash of value of tokenized lexemes.
  var mappedTokens = new Array( rdd.numOfTokens );
  var i;
  for ( i = 0; i < tokens.length; i += tkSize ) {
    // Use mapped spelling — this ensure correct pos tagging & lemmatization etc.
    // as mapped spelling is the gold spelling.
    mappedTokens[ i / tkSize ] = cache.mappedSpelling( tokens[ i ] );
  } // for ( i = 0; i < tokens.length...
  return mappedTokens;
}; // mapRawTokens2UIdOfValue()

// ## mapRawTokens2UIdOfPOS
/**
 * Extracts the default or most likely pos tag for every token.
 * @private
 *
 * @param {object} rdd the raw document data.
 * @returns {array} conatining the default pos tags.
 * @private
*/
var mapRawTokens2UIdOfDefaultPOS = function ( rdd ) {
  // Extract tokens & cache.
  var tokens = rdd.tokens;
  var cache = rdd.cache;
  var posTags = new Array( rdd.numOfTokens );
  let pk = 0;
  for ( let i = 0; i < tokens.length; i += tkSize, pk += 1 ) {
    posTags[ pk ] = ( tokens[ ( i ) + 2 ] === 0 ) ?
                      // Make UNK to NOUN to handle the remote possibility of ML POS being undefined!
                      // Also use mapped spelling — this ensure correct pos tagging & lemmatization etc.
                      // as mapped spelling is the gold spelling.
                      ( cache.posOf( cache.mappedSpelling( tokens[ i ] ) ) || 8 ) :
                      ( ( tokens[ ( i ) + 2 ] & posMask ) >>> bits4lemma ); // eslint-disable-line no-bitwise
  }
  return posTags;
}; // mapRawTokens2UIdOfDefaultPOS()

mappers.mapRawTokens2UIdOfNormal = mapRawTokens2UIdOfNormal;
mappers.mapRawTokens2UIdOfValue = mapRawTokens2UIdOfValue;
mappers.mapRawTokens2UIdOfDefaultPOS = mapRawTokens2UIdOfDefaultPOS;

module.exports = mappers;
