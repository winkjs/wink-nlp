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

var syllables = require( './syllables.js' );
const consts = require( './constants.js' );
const tkSize = consts.tkSize;

var readabilityStats = function ( rdd, its ) {
  // The cache.
  var cache = rdd.cache;
  // wink NLP native tokens.
  var tokens = rdd.tokens;
  // Number of sentences.
  var numOfSentences = rdd.sentences.length;
  // A single token.
  var token;
  // Number of words, syllables, and complex words.
  var numOfWords = 0;
  var numOfSyllables = 0;
  var complexWords = Object.create( null );
  // Flesch Reading Ease Score; initialzied to max value to avoid usage of `undefined`
  // in arithmatic operations.
  var fres = 121;

  for ( let k = 0; k < tokens.length; k += 1 ) {
    if ( its.type( k, tokens, cache ) === 'word' ) {
      token = its.normal( k, tokens, cache );
      numOfWords += 1;
      const ns = syllables( token.toLowerCase() );
      numOfSyllables += ns;
      if ( ns > 3 ) complexWords[ token ] = ns - 3;
    }
    // Compute `fres` as:
    // `206.835 – (1.015 x ASL) – (84.6 x ASW)`
    fres = 206.835 - ( 1.015 * numOfWords / numOfSentences ) - ( 84.6 * numOfSyllables / numOfWords );
  }

  const readingTimeInMins = numOfWords / ( 200 + fres );

  return {
    fres: Math.round( fres ),
    sentiment: +rdd.document[ 3 ].toFixed( 2 ),
    numOfTokens: tokens.length / tkSize,
    numOfWords: numOfWords,
    numOfComplexWords: ( Object.keys( complexWords ) ).length,
    complexWords: complexWords,
    numOfSentences: numOfSentences,
    readingTimeMins: Math.floor( readingTimeInMins ),
    readingTimeSecs: Math.round( ( readingTimeInMins - Math.floor( readingTimeInMins ) ) * 60 )
  };
}; // readabilityStats()

module.exports = readabilityStats;
