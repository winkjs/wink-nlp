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

/* eslint-disable no-console */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var winkNLP = require( '../src/wink-nlp.js' );
var its = require( '../src/its.js' );
var as = require( '../src/as.js' );
var model = require( './test-model/model.js' );
var wordVectors = require( './test-model/languages/cur/models/test-vectors.json' );
var similarity = require( '../utilities/similarity.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'its functions for .out()', function () {
  var nlp = winkNLP( model, null, wordVectors );

  it( 'as.bow', function () {
    expect( nlp.readDoc( 'to be or not to be' ).tokens().out( its.value, as.bow ) ).to.deep.equal( { to: 2, be: 2, or: 1, not: 1 } );
  } );

  it( 'as.set', function () {
    expect( nlp.readDoc( 'to be or not to be' ).tokens().out( its.value, as.set ) ).to.deep.equal( new Set( [ 'to', 'be', 'or', 'not', 'to', 'be' ] ) );
  } );

  it( 'as.freqTable', function () {
    expect( nlp.readDoc( 'three two three two three one' ).tokens().out( its.value, as.freqTable ) ).to.deep.equal( [ [ 'three', 3 ], [ 'two', 2 ], [ 'one', 1 ] ] );
  } );

  it( 'as.bigrams', function () {
    expect( nlp.readDoc( 'a b c d' ).tokens().out( its.value, as.bigrams ) ).to.deep.equal( [ [ 'a', 'b' ], [ 'b', 'c' ], [ 'c', 'd' ] ] );
  } );

  it( 'as.unique', function () {
    expect( nlp.readDoc( 'to be or not to be' ).tokens().out( its.value, as.unique ) ).to.deep.equal( [ 'to', 'be', 'or', 'not' ] );
  } );

  it( 'as.markedUptext', function () {
    var doc = nlp.readDoc( 'this july. next product.' );
    doc.entities().each( ( e ) => ( e.markup() ) );
    expect( doc.sentences().itemAt( 1 ).out( its.markedUpText ) ).to.deep.equal( 'next product.' );
  } );

  it( 'as.vector', function () {
    const sent = 'the dog ran';
    const doc = nlp.readDoc( sent );

    // Check exceptions when as.vector is combined with incompitable its helpers.
    expect( doc.tokens().out.bind( null, its.negationFlag, as.vector ) ).to.throw( 'winkNLP: as.vector is allowed only with its value or normal or lemma.' );
    expect( doc.tokens().filter( ( t ) => t.out().length > 0 ).out.bind( null, its.negationFlag, as.vector ) ).to.throw( 'winkNLP: as.vector is allowed only with its value or normal or lemma.' );

    // Test actual behaviour of as.helper by averaging the vectors of tokens
    // and computing the l2Norm.
    const vDog = nlp.vectorOf( 'dog' );
    const vRan = nlp.vectorOf( 'ran' );
    const sentVector = doc.tokens().filter( (t) => ( t.out( its.type ) === 'word' && !t.out( its.stopWordFlag ) ) ).out(its.value, as.vector );

    // Note, last entry in the array is `l2Norm`, that is why subtract 1 from the length.
    const rVector = new Array( vDog.length - 1 );
    rVector.fill( 0 );
    let ssr = 0;
    for ( let k = 0; k < rVector.length; k += 1 ) {
      rVector[ k ] = +( ( vDog[ k ] + vRan[ k ] ) / 2 ).toFixed( 8 );
      ssr += rVector[ k ] * rVector[ k ];
    }
    rVector.push( +Math.sqrt( ssr ).toFixed( 8 ) );
    expect( rVector ).to.deep.equal( sentVector );

    // Also test the similarity here itself to check both as.vector & similarity.
    const docWith2S = nlp.readDoc( 'The table was in the drawing room. The desk was in the study room.' );
    const s0Vector = docWith2S.sentences().itemAt( 0 ).tokens().filter( (t) => ( t.out( its.type ) === 'word' && !t.out( its.stopWordFlag ) ) ).out(its.value, as.vector );
    const s1Vector = docWith2S.sentences().itemAt( 1 ).tokens().filter( (t) => ( t.out( its.type ) === 'word' && !t.out( its.stopWordFlag ) ) ).out(its.value, as.vector );

    expect( similarity.vector.cosine( s0Vector, s1Vector ) ).to.equal( 0.824834 );
  } );
} );
