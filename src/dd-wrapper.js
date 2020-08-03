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

/* eslint-disable no-underscore-dangle */

var constants = require( './constants.js' );

// Bits reserved for `precedingSpaces`.
var bits4PrecedingSpace = constants.bits4PrecedingSpace;
// Size of a single expansion.
var xpSize = constants.xpSize;
// Bits reserved for `lemma`.
var bits4lemma = constants.bits4lemma;
// The UNK!
var UNK = constants.UNK;

var docDataWrapper = function ( data ) {
  // Extract frequently referred data elements:
  // Extract `cache`.
  var cache = data.cache;
  // Extract `tokens`.
  var tokens = data.tokens;

  // Returned!
  var methods = Object.create( null );

  // ## addToken
  /**
   *
   * It first creates a new lexeme entry into the `cache` and then this entry
   * is pushed into the `tokens` array alongwith the `precedingSpaces` and
   * rest of the token properties are initialized to `0`.
   *
   * @param {string} text to be added as token.
   * @param {string} category of the token.
   * @param {number} precedingSpaces to the `text` as parsed by tokenizer.
   * @param {number[]} tokens, where the token is added.
   * @returns {boolean} always `true`.
   * @private
  */
  var addToken = function ( text, category, precedingSpaces ) {
    tokens.push( cache.add( text, category ), precedingSpaces, 0, 0 );
    return true;
  }; // addToken()

  // ## addTokenIfInCache
  /**
   *
   * Adds a token corresponding to the input `text` if it is found in cache i.e.
   * not an OOV. The addition process ensures the following:
   * 1. Preceding spaces are added.
   * 2. If text is a contraction, it expansions are added. Since expansins
   * consists of lexeme, normal, lemma and pos, all of these are added to the
   * token structure.
   *
   * @param {string} text to be added as token.
   * @param {number} precedingSpaces to the `text` as parsed by tokenizer.
   * @returns {boolean} `truthy` if `text` is found in cache otherwise `falsy`.
   * @private
  */
  var addTokenIfInCache = function ( text, precedingSpaces ) {
    // The array `tokenIndex` will contain 1-element if `text` is not a predefined
    // contraction; otherwise it will contain `n x 4` elements, where `n` is the
    // number of expansions.
    var tokenIndex = cache.lookup( text );
    // Temp for preceding space in case of contarction.
    var ps;
    // Temp for lemma & pos.
    var lemma, pos;

    // `UNK` means 0 or `falsy`; it flags that token has not been added.
    if ( tokenIndex === null ) return UNK;

    if ( tokenIndex.length === 1 ) {
      tokens.push( tokenIndex[ 0 ], precedingSpaces, 0, 0 );
    } else {
      // Contraction, itereate through each expansion.
      for ( let k = 0; k < tokenIndex.length; k += xpSize ) {
        // The `precedingSpaces` will be 0 except for the first expansion.
        ps = ( k === 0 ) ? precedingSpaces : 0;
        // Concatenate pointer to normal contained in `xpansions` with preceding
        // spaces.
        ps |= ( tokenIndex[ k + 1 ] << bits4PrecedingSpace ); // eslint-disable-line no-bitwise
        // Lemma & POS are fixed mostly for all contractions.
        lemma = tokenIndex[ k + 2 ];
        pos   = tokenIndex[ k + 3 ];
        // Add token; annotations may be filled later in the pipeline.
        tokens.push( tokenIndex[ k ], ps, ( lemma | ( pos << bits4lemma ) ), 0 ); // eslint-disable-line no-bitwise
      }
    }
    // Return `truthy`, indicating that token(s) has been added successfully.
    return 99;
  }; // addTokenIfInCache()

  // ## isLexeme
  /**
   *
   * Tests if the `text` is a valid lexeme or not.
   *
   * @param {string} text to be added as token.
   * @returns {boolean} `truthy` if `text` is a valid lexeme otherwise `falsy`.
   * @private
  */
  var isLexeme = function ( text ) {
    // Return `truthy` if the text is valid i.e. found. Note for `$%^OOV^%$`, it returns
    // `0` i.e. `falsy`!
    return cache.lookup( text );
  }; // isLexeme()

  var clean = function () {
    tokens = null;
    cache = null;
  }; // clean()

  methods._addToken = addToken;
  methods._addTokenIfInCache = addTokenIfInCache;
  methods.isLexeme = isLexeme;
  methods.clean = clean;

  return methods;
}; // docDataWrapper()

module.exports = docDataWrapper;
