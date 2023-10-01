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

const adjectiveExceptions = require( './wn-adjective-exceptions.js' );
const nounExceptions = require( './wn-noun-exceptions.js' );
const verbExceptions = require( './wn-verb-exceptions.js' );

const lemmatizeAdjective = function ( value, cache ) {
  var lemma = adjectiveExceptions[ value ];
  if ( lemma ) return lemma;

  lemma = value.replace( /est$|er$/, '' );
  if ( lemma.length === value.length ) return value;
  if ( cache.hasSamePOS( lemma, 'ADJ' ) ) return lemma;
  lemma += 'e';
  if ( cache.hasSamePOS( lemma, 'ADJ' ) ) return lemma;
  return value;
}; // adjective()

const lemmatizeVerb = function ( value, cache ) {
  var lemma = verbExceptions[ value ];
  if ( lemma ) return lemma;

  lemma = value.replace( /s$/, '' );
  if ( lemma.length !== value.length && cache.hasSamePOS( lemma, 'VERB' ) ) return lemma;

  lemma = value.replace( /ies$/, 'y' );
  if ( lemma.length !== value.length && cache.hasSamePOS( lemma, 'VERB' ) ) return lemma;

  lemma = value.replace( /es$|ed$|ing$/, '' );
    if ( lemma.length !== value.length ) {
    if ( cache.hasSamePOS( lemma, 'VERB' ) ) return lemma;
    lemma += 'e';
    if ( cache.hasSamePOS( lemma, 'VERB' ) ) return lemma;
  }
  return value;
}; // verb()

const nounRegexes = [
  { replace: /s$/, by: '' },
  { replace: /ses$/, by: 's' },
  { replace: /xes$/, by: 'x' },
  { replace: /zes$/, by: 's' },
  { replace: /ves$/, by: 'f' },
  { replace: /ches$/, by: 'ch' },
  { replace: /shes$/, by: 'sh' },
  { replace: /ies$/, by: 'y' }
];
const lemmatizeNoun = function ( value, cache ) {
  var lemma = nounExceptions[ value ];
  if ( lemma ) return lemma;

  lemma = value;
  for ( let k = 0; k < nounRegexes.length; k += 1 ) {
    lemma = value.replace( nounRegexes[ k ].replace, nounRegexes[ k ].by );

    if ( lemma.length !== value.length && cache.hasSamePOS( lemma, 'NOUN' ) ) return lemma;
  }

  // Nothing worked, may be its men or women! If nothing the value is returned.
  return value.replace( /men$/, 'man' );
}; // noun()

const lemmatize = function ( value, pos, cache ) {
  var lemma;
  switch ( pos ) {
    case 'ADJ':
      lemma = lemmatizeAdjective( value, cache );
    break;

    case 'NOUN':
      lemma = lemmatizeNoun( value, cache );
    break;

    case 'VERB':
      lemma = lemmatizeVerb( value, cache );
    break;

    default:
      lemma = value;
  }

  return lemma;
}; // lemmatize()

module.exports = lemmatize;
