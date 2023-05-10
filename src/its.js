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
var constants = require( './constants.js' );
var caseMap = [ 'other', 'lowerCase', 'upperCase', 'titleCase' ];
var swi = require( './sentence-wise-importance.js' );

// Size of a single token.
var tkSize = constants.tkSize;
// Bits reserved for `lemma`.
var bits4lemma = constants.bits4lemma;
// Mask for extracting pos
var posMask = constants.posMask;
// Mask for preceding spaces.
var psMask = constants.psMask;
// Mask for lemma in case of contraction.
var lemmaMask = constants.lemmaMask;

var its = Object.create( null );

its.case = function ( index, tokens, cache ) {
  return caseMap[ cache.property( tokens[ index * tkSize ], 'lutCase' ) ];
}; // case()

its.uniqueId = function ( index, tokens ) {
  return tokens[ index * tkSize ];
}; // uniqueId()

its.negationFlag = function ( index, tokens ) {
  return tokens[ ( index * tkSize ) + 3 ] >= constants.negationFlag;
}; // negationFlag()

its.normal = function ( index, tokens, cache ) {
  return (
    ( tokens[ ( index * tkSize ) + 1 ] > 65535 ) ?
      cache.value( cache.nox( tokens[ ( index * tkSize ) + 1 ] ) ) :
      cache.value( cache.normal( tokens[ index * tkSize ] ) )
  );
}; // normal()

its.contractionFlag = function ( index, tokens ) {
  return ( tokens[ ( index * tkSize ) + 1 ] > 65535 );
}; // contractionFlag()

its.pos = function ( index, tokens, cache ) {
  return cache.valueOf( 'pos', ( tokens[ ( index * tkSize ) + 2 ] & posMask ) >>> bits4lemma );  // eslint-disable-line no-bitwise
}; // pos()

its.precedingSpaces = function ( index, tokens ) {
  var token = tokens[ ( index * tkSize ) + 1 ];
  var count = token & psMask;  // eslint-disable-line no-bitwise
  return ( ''.padEnd( count ) );
}; // precedingSpaces()

its.prefix = function ( index, tokens, cache ) {
  return cache.property( tokens[ index * tkSize ], 'prefix' );
}; // prefix()

its.shape = function ( index, tokens, cache ) {
  return cache.property( tokens[ index * tkSize ], 'shape' );
}; // shape()

its.stopWordFlag = function ( index, tokens, cache ) {
  // Apply check on normalized token and not the original value, because
  // stop words are always defined in the lowercase.
  var normal = ( tokens[ ( index * tkSize ) + 1 ] > 65535 ) ?
    cache.nox( tokens[ ( index * tkSize ) + 1 ] ) :
    cache.normal( tokens[ index * tkSize ] );
  return ( cache.property( normal, 'isStopWord' ) === 1 );
}; // stopWordFlag()

its.abbrevFlag = function ( index, tokens, cache ) {
  return ( cache.property( tokens[ index * tkSize ], 'isAbbrev' ) === 1 );
}; // abbrevFlag()

its.suffix = function ( index, tokens, cache ) {
  return cache.property( tokens[ index * tkSize ], 'suffix' );
}; // suffix()

its.type = function ( index, tokens, cache ) {
  return cache.property( tokens[ index * tkSize ], 'tokenType' );
}; // type()

its.value = function ( index, tokens, cache ) {
  return cache.value( tokens[ index * tkSize ] );
}; // value()

its.stem = function ( index, tokens, cache, addons ) {
  return addons.stem( cache.value( tokens[ index * tkSize ] ) );
}; // stem()

its.lemma = function ( index, tokens, cache, addons ) {
  // If it is a contraction that lemma is already available in the token's data structure.
  if ( tokens[ ( index * tkSize ) + 1 ] > 65535 ) {
    return cache.value( tokens[ ( index * tkSize ) + 2 ] & lemmaMask ); // eslint-disable-line no-bitwise
  }
  // Handle mapped spelling if any.
  const mappedIdx = cache.mappedSpelling( tokens[ index * tkSize ] );
  // If the token has single lemma then no further processing is needed.
  if ( cache.property( mappedIdx, 'isSLemma' ) === 1 ) {
    return cache.value( cache.property( mappedIdx, 'lemma' ) );
  }
  // Exhausted all possibilities to avoid processing! Now lemmatize!
  const pos = its.pos( index, tokens, cache );
  const value = cache.value( cache.normal( tokens[ index * tkSize ] ) );
  return addons.lemmatize( value, pos, cache );
}; // lemmas()

its.vector = function ( ) {
  return ( new Array( 100 ).fill( 0 ) );
}; // vector()

its.detail = function ( ) {
  return true;
}; // detail()

its.markedUpText = function ( index, tokens, cache ) {
  // This is a special case because `tokens.out()` allows `as.markedUpText`.
  // Therefore simply return the value and rest is handled by `colTokensOut` with
  // `as.markedUpText()`` or `as.text()` as one of the arugments.
  return its.value( index, tokens, cache );
}; // markedUpText()

its.span = function ( spanItem ) {
  return spanItem.slice( 0, 2 );
}; // span()

its.sentiment = function ( spanItem ) {
  return spanItem[ 3 ];
}; // span()

its.readabilityStats = function ( rdd, addons ) {
  return addons.readabilityStats( rdd, its );
}; // readabilityStats()

its.sentenceWiseImportance = function ( rdd ) {
  return swi( rdd );
}; // sentenceWiseImportance()

/* ------ utilities ------ */

its.terms = function ( tf, idf, terms ) {
  return terms;
}; // terms()

its.docTermMatrix = function ( tf, idf, terms ) {
  const dtm = new Array( tf.length );
  for ( let id = 0; id < tf.length; id += 1 ) {
    dtm[ id ] = [];
    for ( let i = 0; i < terms.length; i += 1 ) {
      dtm[ id ].push( tf[ id ][ terms[ i ] ] || 0 );
    }
  }
  return dtm;
}; // getDocTermMatrix()

its.docBOWArray = function ( tf ) {
  return tf;
}; // docBOWArray()

its.bow = function ( tf ) {
  return tf;
}; // bow()

its.idf = function ( tf, idf ) {
  var arr = [];
  for ( const t in idf ) { // eslint-disable-line guard-for-in
    arr.push( [ t, idf[ t ] ] );
  }
  // Sort on frequency followed by the term.
  return arr.sort( sort4FT );
}; // idf()

its.tf = function ( tf ) {
  const arr = [];
  for ( const t in tf ) {  // eslint-disable-line guard-for-in
    arr.push( [ t, tf[ t ] ] );
  }
  // Sort on frequency followed by the term.
  return arr.sort( sort4FT );
}; // tf()

its.modelJSON = function ( tf, idf, terms, docId, sumOfAllDLs ) {
  return JSON.stringify( {
      uid: 'WinkNLP-BM25Vectorizer-Model/1.0.0',
      tf: tf,
      idf: idf,
      terms: terms,
      docId: docId,
      sumOfAllDLs: sumOfAllDLs
   } );
}; // model()

module.exports = its;
