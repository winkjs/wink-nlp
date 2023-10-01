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

const transformers = new Array( 1 );

const constants = require( './constants.js' );
// Size of a single token.
var tkSize = constants.tkSize;
// Bits reserved for `lemma`.
var bits4lemma = constants.bits4lemma;
// Mask for extracting pos
var posMask = constants.posMask;

transformers[ 0 ] = function ( t, itsUndefined, config, index ) {
  var cache = config.rdd.cache;
  var tokens = config.rdd.tokens;
  var preserve = config.preserve;
  var value = cache.value( tokens[ index * tkSize ] );
  var normal;
  var pos;

  // All tokens have numeric value as they arrive from the `tokens4Automata` array.
  // But when entity substitution is turned on, then at the start of the span the
  // value is replaced by the entity-name, which is string. Therefore, if `t` is
  // a string, just return the value as-is because it is an entity — no need to
  // map via `preserve`!
  if ( typeof t === 'string' ) return t;
  // The value can be found in preserve in two cases, viz. (a) the flag `matchValue`
  // is true OR (b) it is an esacped property, which is always in UPPERCASE.
  if ( preserve[ value ] ) return preserve[ value ];

  // If value match is not required, then map `normal` via `preserve`.
  if ( !config.matchValue ) {
    normal = cache.value( t );
    if ( preserve[ normal ] ) return preserve[ normal ];
  }

  // If `usePOS` is required then extract POS and return.
  if ( config.usePOS ) {
    pos = cache.valueOf( 'pos', ( tokens[ ( index * tkSize ) + 2 ] & posMask ) >>> bits4lemma );  // eslint-disable-line no-bitwise
    return pos;
  }

  // Follow the ordering.
  if ( config.matchValue ) return value;
  return normal;
};

module.exports = transformers;
