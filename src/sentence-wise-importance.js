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

const constants = require( './constants.js' );
// Bits reserved for `lemma`.
const bits4lemma = constants.bits4lemma;
// Mask for extracting pos
const posMask = constants.posMask;
// Size of a single token.
const tkSize = constants.tkSize;

/**
 * This implementation is inspired by the hypothesis that *content salience is proportional
 * to the frequency of part-of-speech n-grams* as outlined in the paper titled,
 * [Examining the Content Load of Part of Speech Blocks for Information Retrieval](https://dl.acm.org/doi/10.5555/1273073.1273142).
 *
 * @param {object} rdd  Raw Document Data structure containing the document whose
 *                      sentence wise importance will be determined.
 * @returns {object[]}  array of objects, in form of `{ index: <integer>, importance: <0–1>}`,
 *                      where index points to the sentence; 1 means highest importance and 0 indicates lowest.
 */
const sentenceWiseImportance = function ( rdd ) {
    // Define open class part-of-speeches; used to compute intitial information content
    const openClassPOS = Object.create(null);
    openClassPOS.ADJ = true;
    openClassPOS.ADV = true;
    openClassPOS.INTJ = true;
    openClassPOS.NOUN = true;
    openClassPOS.PROPN = true;
    openClassPOS.VERB = true;
    openClassPOS.NUM = true;
    openClassPOS.SYM = true;
    // N-gram to use to construct a pos group.
    const NGram = 4;
    const sentences = rdd.sentences;
    const tokens = rdd.tokens;
    const cache = rdd.cache;

    // Used to build table of weights of pos groups. Apart from frequency, it also maintains
    // (a) array of sentences, where a given pos group was found, (b) total weight computed as
    // frequency minus count of closed class part-of-speech in the group.
    const posGroupWeightTable = Object.create( null );

    for ( let s = 0; s < sentences.length; s += 1 ) {
      const pos = [];
      const [ start, end ] = sentences[ s ];
      for ( let t = start; t <= end; t += 1 ) {
        const p = cache.valueOf( 'pos', ( tokens[ ( t * tkSize ) + 2 ] & posMask ) >>> bits4lemma ); // eslint-disable-line no-bitwise
        if ( p !== 'SPACE' && p !== 'PUNCT' ) pos.push( p );
      }

      // Ignore sentences where we cannot build NGram i.e. sentences shorter than NGram.
      if ( pos.length < 4 ) continue; // eslint-disable-line no-continue
      // Determine NGrams;
      for ( let k = 0; k + NGram - 1 < pos.length; k += 1 ) {
        const pos4Gram = pos.slice( k, k + NGram );
        // Used to compute the weight for a pos group.
        const initInfoContent = pos4Gram.reduce(
          ( pv, cv ) => pv - ( ( openClassPOS[cv] ) ? 0 : 1 ),
          0
        );
        const posGroup = pos4Gram.join( '_' );
        posGroupWeightTable[ posGroup ] = posGroupWeightTable[ posGroup ] || Object.create( null );
        posGroupWeightTable[ posGroup ].group = posGroup;
        posGroupWeightTable[ posGroup ].sentences = posGroupWeightTable[ posGroup ].sentences || [];
        posGroupWeightTable[ posGroup ].sentences.push( s ); // ?
        posGroupWeightTable[ posGroup ].weight = ( posGroupWeightTable[ posGroup ].weight === undefined ) ?
                                                  initInfoContent + 1 :
                                                  ( posGroupWeightTable[ posGroup ].weight + 1 );
        posGroupWeightTable[ posGroup ].iv = initInfoContent;
      }
    }

    // Transform object into an array, and filter out elements with weight <= 0.
    const posGroupWeights = Object.keys( posGroupWeightTable )
                              .map( ( e ) => posGroupWeightTable[ e ] )
                              .filter( ( e ) => e.weight > 0 );
    // This is an array index by each sentence's index and would contain the total weight
    // computed by adding all the weights of each pos group found in that sentence.
    const sentenceWiseWeights = new Array( sentences.length );
    sentenceWiseWeights.fill( 0 );
    posGroupWeights.forEach( ( pgw ) => {
      pgw.sentences.forEach( ( e ) => {
         sentenceWiseWeights[ e ] += pgw.weight;
        } );
    });
    // Normalize weights by dividing them by the max.
    let max = Math.max( ...sentenceWiseWeights );
    // Avoid divide by zero situation
    if ( max === 0 ) max = 1;

    return sentenceWiseWeights.map( ( e, i ) => ( { index: i, importance: +( e / max ).toFixed( 4 ) } ) );
  };

  module.exports = sentenceWiseImportance;
