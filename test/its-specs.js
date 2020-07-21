//     wink-nlp
//     Production-ready Natural Language Processing
//
//     Copyright (C) 2017-20  GRAYPE Systems Private Limited
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

  it( 'its.case', function () {
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'lowerCase' );
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'titleCase' );
    expect( nlp.readDoc( 'THE' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'upperCase' );
    expect( nlp.readDoc( 'ThE' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
    expect( nlp.readDoc( '1' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
    expect( nlp.readDoc( '.' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
  } );

  it( 'its.normal', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'THE' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'ThE' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( '1' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( '1' );
    expect( nlp.readDoc( 'recognise' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'recognize' );
    expect( nlp.readDoc( 'can\'t' ).tokens().out( its.normal ) ).to.deep.equal( [ 'can', 'not' ] );
  } );

  // This needs to be re-written once pos tagging is enabled.
  it( 'its.pos', function () {
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.pos ) ).to.equal( 'DET' );
  } );

  it( 'its.precedingSpaces', function () {
    expect( nlp.readDoc( 'the   3' ).tokens().itemAt( 1 ).out( its.precedingSpaces ) ).to.equal( '   ' );
  } );

  it( 'its.prefix', function () {
    expect( nlp.readDoc( 'prefix' ).tokens().itemAt( 0 ).out( its.prefix ) ).to.equal( 'pr' );
  } );

  it( 'its.suffix', function () {
    expect( nlp.readDoc( 'suffix' ).tokens().itemAt( 0 ).out( its.suffix ) ).to.equal( 'fix' );
  } );

  it( 'its.shape', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xxx' );
    expect( nlp.readDoc( 'TheOne' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'XxxXxx' );
    expect( nlp.readDoc( 'A1' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xd' );
    expect( nlp.readDoc( 'Abcdef123456' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xxxxxdddd' );
  } );

  it( 'its.type', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'word' );
    expect( nlp.readDoc( '22.4' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'number' );
    expect( nlp.readDoc( 'myhotmail@gmail.com' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'email' );
    expect( nlp.readDoc( '@Oracle' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'mention' );
    expect( nlp.readDoc( '#hash' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'hashtag' );
  } );

  it( 'its.value', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.value ) ).to.equal( 'The' );
  } );

  it( 'its.uniqueId', function () {
    expect( nlp.readDoc( '$%^oov^%$' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 0 );
    expect( nlp.readDoc( '\n' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 1 );
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 72846 );
  } );

  it( 'its.negationFlag', function () {
    expect( nlp.readDoc( 'I did not like.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'like' ] );
    expect( nlp.readDoc( 'Not good co. I am ok.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'good' ] );
    expect( nlp.readDoc( 'not good, but ok.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'good' ] );
  } );

  it( 'its.stopWordFlag', function () {
    // Use contraction to ensure expansions are tested properly.
    expect( nlp.readDoc( 'I didn\'t like.' ).tokens().out( its.stopWordFlag ) ).to.deep.equal( [ true, true, true, false, false ] );
  } );

  it( 'its.abbrevFlag', function () {
    expect( nlp.readDoc( 'I. K. Raj worked for Google Inc.' ).tokens().out( its.abbrevFlag ) ).to.deep.equal( [ true, true, false, false, false, false, true ] );
  } );

  it( 'its.contractionFlag', function () {
    expect( nlp.readDoc( 'I can\'t go' ).tokens().out( its.contractionFlag ) ).to.deep.equal( [ false, true, true, false ] );
  } );

  it( 'its.sentiment', function () {
    expect( nlp.readDoc( 'I am sick' ).out( its.sentiment ) ).to.deep.equal( -0.4 );
  } );

  it( 'slected entity with its.detail, its.span as.?', function () {
    const s = 'Conut downn starts from ten, nine, eight...';
    const se = nlp.readDoc( s ).entities().filter( ( e ) => ( e.out( its.type ) === 'CARDINAL' ) );
    expect( se.out( its.span, as.freqTable ) ).to.deep.equal( [ [ 4, 4 ], [ 6, 6 ], [ 8, 8 ] ] );
    expect( se.out( its.detail, as.freqTable ) ).to.deep.equal( [ { type: 'CARDINAL', value: 'ten' }, { type: 'CARDINAL', value: 'nine' }, { type: 'CARDINAL', value: 'eight' } ] );
    expect( se.out( its.type, as.freqTable ) ).to.deep.equal( [ [ 'CARDINAL', 3 ] ] );
  } );

  it( 'stubs test', function () {
    const v = ( new Array( 100 ) ).fill( 0 );
    expect( its.vector( ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).tokens().out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).tokens().itemAt( 0 ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are 3 vectors' ).tokens().filter( ( t ) => ( t.out( its.type ) === 'word' ) ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).sentences().out( its.vector ) ).to.deep.equal( [ v ] );
    expect( its.detail() ).to.deep.equal( true );
  } );
} );
