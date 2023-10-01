//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp language models”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions =
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

const hintDelta = 1080000;
const $right_spc_amb_qt = 6; // eslint-disable-line camelcase
const $right_amb_qt = 4; // eslint-disable-line camelcase
const $likely_eos = 7; // eslint-disable-line camelcase
const $non_eos = 8; // eslint-disable-line camelcase
const transformers = new Array( 1 );
// Preceeding Spaces Mask — TO BE Replaced by the constants.js later.
const psMask = 0xFFFF;
// First Pass
transformers[ 0 ] = function ( token, cache, rawTokens, i ) {
  var mapped = cache.property( token, 'sbdHint' ) || cache.property( rawTokens[ i * 4 ], 'sbdHint' );
  // Check if the `token` is a ambiguous double quote.
  if ( mapped === $right_amb_qt ) { // eslint-disable-line camelcase
    // If so find if it has any preceeding spaces and mapp it accordingly.
    mapped = ( rawTokens[ ( i * 4 ) + 1 ] & psMask ) ? $right_spc_amb_qt : $right_amb_qt;  // eslint-disable-line no-bitwise, camelcase
  }
  // If mapped, add the hint delta offset and return.
  if ( mapped ) return mapped + hintDelta;

  if ( cache.property( token, 'isAbbrev' ) ) {
    return ( ( cache.value( token ).length === 2 ) ? $non_eos : $likely_eos ) + hintDelta; // eslint-disable-line camelcase
  }
  // Otherwise return the incoming `token` as-is.
  return token;
};

// transformers[ 0 ] = undefined;

module.exports = transformers;
