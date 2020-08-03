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

var constants = require( '../constants.js' );
// Size of a single token.
var tkSize = constants.tkSize;
// Mask for preceding spaces.
var psMask = constants.psMask;
// Bits reserved for `lemma`.
var bits4lemma = constants.bits4lemma;
// Mask for extracting pos
var posMask = constants.posMask;


// ### printTokens
/**
 *
 * Prints a table of tokens along with their properties on console.
 *
 * @param {number[]} tokens The tokens.
 * @param {object} cache The language `cache`.
 * @returns {void} Nothing!
 * @private
*/
var printTokens = function ( tokens, cache ) {
  var imax = tokens.length;
  var i, j;
  var t, tv;
  var pad = '                         ';
  var str;
  var props = [ 'prefix', 'suffix', 'shape', 'lutCase', 'nerHint', 'tokenType' ];

  // Print header.
  console.log( '\n\ntoken      p-spaces   prefix  suffix  shape   case    nerHint type     normal/pos' );
  console.log( '———————————————————————————————————————————————————————————————————————————————————————' );
  for ( i = 0; i < imax; i += tkSize ) {
    str = '';
    t = tokens[ i ];
    tv = cache.value( t );
    str += ( JSON.stringify( tv ).replace( /"/g, '' )  + pad ).slice( 0, 18 );
    str += ( ( tokens[ i + 1 ] & psMask ) + pad ).slice( 0, 4 );  // eslint-disable-line no-bitwise
    for ( j = 0; j < props.length; j += 1 ) {
      str += ( JSON.stringify( cache.property( t, props[ j ] ) ).replace( /"/g, '' ) + pad ).slice( 0, 8 );
    }
    if ( tokens[ i + 1 ] > 65535 ) {
      str += ' ' + cache.value( cache.nox( tokens[ i + 1 ] ) ); // eslint-disable-line no-bitwise
      str += ' / ' + cache.valueOf( 'pos', ( tokens[ i + 2 ] & posMask ) >>> bits4lemma ); // eslint-disable-line no-bitwise
    } else {
      str += ' ' + JSON.stringify( cache.value( cache.normal( t ) ) ).replace( /"/g, '' );
      str += ' / ' + cache.property( t, 'pos' );
    }

    // str += '/' + cache.property( t, 'nerHint' );  // eslint-disable-line no-bitwise
    console.log( str );
    // Not being used as of now; to use move it before the console.log!
    str += ' / ' + cache.valueOf( 'pos', ( tokens[ i + 2 ] & posMask ) >>> bits4lemma );  // eslint-disable-line no-bitwise
  }

  // Print total number of tokens.
  console.log( '\n\ntotal number of tokens: %d', tokens.length / tkSize );
}; // printTokens()

module.exports = printTokens;
