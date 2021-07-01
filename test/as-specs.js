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

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'its functions for .out()', function () {
  var nlp = winkNLP( model );

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
} );
