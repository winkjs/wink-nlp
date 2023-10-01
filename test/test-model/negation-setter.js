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

var setter = function ( px, dd, constants, search ) {
  // Used to extract token type so that only words are negated.
  const getProperty = dd.cache.property;
  // Document Negation Flag.
  let dnf = 0;
  let k = 0; // Index into `px`.
  while ( k < px.length ) {
    if ( px[ k ][ 2 ] === '2' ) {
      k += 1;
    } else {
      // Start Negation From.
      const snf = px[ k ][ 1 ] + 1;
      // Find the sentence id that contains **this: `px[ k ][ 1 ]`** negation.
      const negSId = search( px[ k ][ 1 ], dd.sentences );
      // Terminate Negation At. Assume it to be end-of-sentence.
      let tna = dd.sentences[ negSId ][ 1 ];
      // At this point also set the negation Flag
      dd.sentences[ negSId ][ 2 ] = 1;
      // Even if one sentence has negationFlag as true, set dnf also as true(1).
      dnf = 1;
      // Move to next `px`; it can be either another negation or termination.
      // In both cases, we are goint to mark negation upto it.
      k += 1;
      if ( k < px.length ) {
        tna = ( tna < px[ k ][ 0 ] ) ? tna : px[ k ][ 0 ];
      } else {
        // Otherwise mark everything upto the end-of-sentence.
        tna += 1;
      }
      // Flag negated tokens, if any.
      for ( let i = snf; i < tna; i += 1 ) {
        // Extract Token Type.
        const tt = getProperty( dd.tokens[ ( i * constants.tkSize ) ], 'tokenType' );
        // Do not negate `punctuation`, `emoji`, and `emoticon`.
        if ( tt !== 'punctuation' && tt !== 'emoji' && tt !== 'emoticon' ) {
          dd.tokens[ ( i * constants.tkSize ) + 3 ] = constants.negationFlag;
        }
      }
    }
  } // while
  // Set negation flag for document.
  dd.document[ 2 ] = dnf;
}; // setter()

module.exports = setter;
