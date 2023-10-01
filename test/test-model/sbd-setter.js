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

var setter = function ( px, rdd ) {
  var numOfTokens = rdd.numOfTokens;
  // Note the `px` is marking **only** the **last token** of the sentence and
  // therefore the start & end token indexes are identical.
  // Map `px` to `rdd.sentences`.
  // Start with setting up all tokens placed in to a single sentence. The `si`
  // is **sentence #i**. The structure of sentence is:<br/>
  // `[ start, end, negationFlag, sentimentScore ]`
  var si = [ 0, ( numOfTokens - 1 ), 0, 0 ];
  // Iterate through the sentences detected.
  for ( let i = 0; i < px.length; i += 1 ) {
    // As **start** will always be correct, only need to update the **end**.
    si[ 1 ] = px[ i ][ 0 ];
    if ( i < ( px.length - 1 ) ) {
      rdd.sentences.push( si );
      // Again set the end to the last token, which may get updated if more
      // sentences are found.
      si = [ px[ i ][ 0 ] + 1, ( numOfTokens - 1 ), 0, 0 ];
    }
  }
  // Push the last sentence.
  rdd.sentences.push( si );
  // Handle the case when the last sentence is floating i.e. the without a
  // end-of-sentence punctuation sign.
  if ( si[ 1 ] < ( numOfTokens - 1 ) ) {
    rdd.sentences.push( [ ( si[ 1 ] + 1 ), ( numOfTokens - 1 ), 0, 0 ] );
  }
}; // setter()

module.exports = setter;
