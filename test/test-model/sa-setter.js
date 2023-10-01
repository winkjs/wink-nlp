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

var setter = function ( px, rdd, constants, locate ) {
  // Extract token size.
  const tkSize = constants.tkSize;
  // Document Sentiment Score.
  let dss = 0;
  // Index into `px`.
  let k = 0;
  while ( k < px.length ) {
      // Sentence Id that contains kth px<start>.
      const sid = Math.ceil( locate( px[ k ][ 0 ], rdd.sentences ) );
      // Index to the last px contained in the sentence indexed by sid.
      const kend = Math.floor( locate( rdd.sentences[ sid ][ 1 ], px ) );
      // Sentence Sentiment Score.
      let sss = 0;
      for ( let i = k; i <= kend; i += 1 ) {
        // Need to multiply by 1000 as each score is actual score * 1000.
        px[ i ][ 2 ] = ( +px[ i ][ 2 ] ) / 1000;
        // Apply negation.
        if ( rdd.tokens[ ( px[ i ][ 0 ] * tkSize ) + 3 ] >= constants.negationFlag ) {
          // Negative score, subtract it.
          sss -= px[ i ][ 2 ];
        } else {
          // Positive score, add it.
          sss += px[ i ][ 2 ];
        }
      }
      // Update the sentimet score at the sid-sentence.
      rdd.sentences[ sid ][ 3 ] = ( sss / ( kend - k + 1 ) );
      dss += rdd.sentences[ sid ][ 3 ];
      // Update `k`.
      k = kend + 1;
  } // while
  // Update Document Sentiment Score.
  rdd.document[ 3 ] = dss / rdd.numOfSentences;
}; // setter()

module.exports = setter;
