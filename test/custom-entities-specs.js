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
var model = require( './test-model/model.js' );
var its = require( '../src/its.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

var nlp = winkNLP( model );

describe( 'Detect from learned examples', function () {
  var examples = [
    { name: 'pet-type', patterns: [ '[ADJ] [cat|dog]' ], mark: [ 0, 0 ] },
    { name: 'adj-noun', patterns: [ 'ADJ [NOUN]' ], mark: [ 0, 0 ] },
    { name: 'crust-type', patterns: [ 'thin', 'regular', 'thick' ] },
    { name: 'escaped-adj-parrot', patterns: [ '^ADJ Parrot' ] },
    { name: 'escaped-money', patterns: [ '^MONEY' ] },
    { name: 'entity-money', patterns: [ 'MONEY' ] },
    { name: 'pos-type-money', patterns: [ 'SYM NUM' ] },
    { name: 'caret', patterns: [ '^^' ] },
    { name: 'caret-carrot', patterns: [ '^^carrot' ] },
    { name: 'email-emoticon', patterns: [ '[|EMAIL] EMOTICON' ] },
  ];

  var s1 = 'one@two.com:-) A ^green cat ate thin crust pizza with a blue dog! ADJ Parrot? $5 #MoNEY. ^ carrot!';

  it( 'config 000 must work correctly', function () {
    const config = { matchValue: false, usePOS: false, useEntity: false };
    const expectedEntities = [
      { value: '^', type: 'caret' },
      { value: 'thin', type: 'crust-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 001 must work correctly', function () {
    const config = { matchValue: false, usePOS: false, useEntity: true };
    const expectedEntities = [
      { value: 'one@two.com:-)', type: 'email-emoticon' },
      { value: '^', type: 'caret' },
      { value: 'thin', type: 'crust-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'entity-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 010 must work correctly', function () {
    const config = { matchValue: false, usePOS: true, useEntity: false };
    const expectedEntities = [
      { value: '^', type: 'caret' },
      { value: 'green', type: 'pet-type' },
      { value: 'thin', type: 'crust-type' },
      { value: 'blue', type: 'pet-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'pos-type-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 011 must work correctly', function () {
    const config = { matchValue: false, usePOS: true, useEntity: true };
    const expectedEntities = [
      { value: 'one@two.com:-)', type: 'email-emoticon' },
      { value: '^', type: 'caret' },
      { value: 'green', type: 'pet-type' },
      { value: 'thin', type: 'crust-type' },
      { value: 'blue', type: 'pet-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'entity-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 100 must work correctly', function () {
    const config = { matchValue: true, usePOS: false, useEntity: false };
    const expectedEntities = [
      { value: '^', type: 'caret' },
      { value: 'thin', type: 'crust-type' },
      // { value: 'ADJ Parrot', type: 'escaped-adj-parrot' }, as s1 has been lowercased!
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1.toLowerCase() );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 101 must work correctly', function () {
    const config = { matchValue: true, usePOS: false, useEntity: true };
    const expectedEntities = [
      { value: 'one@two.com:-)', type: 'email-emoticon' },
      { value: '^', type: 'caret' },
      { value: 'thin', type: 'crust-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'entity-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 110 must work correctly', function () {
    const config = { matchValue: true, usePOS: true, useEntity: false };
    const expectedEntities = [
      { value: '^', type: 'caret' },
      { value: 'green', type: 'pet-type' },
      { value: 'thin', type: 'crust-type' },
      { value: 'blue', type: 'pet-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'pos-type-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'config 111 must work correctly', function () {
    const config = { matchValue: true, usePOS: true, useEntity: true };
    const expectedEntities = [
      { value: 'one@two.com:-)', type: 'email-emoticon' },
      { value: '^', type: 'caret' },
      { value: 'green', type: 'pet-type' },
      { value: 'thin', type: 'crust-type' },
      { value: 'blue', type: 'pet-type' },
      { value: '$5', type: 'entity-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1.toLowerCase() );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'should detect a single emoticon with optinal email in the pattern', function () {
    const expectedEntities = [
      { value: ':-)', type: 'email-emoticon' },
    ];
    nlp.learnCustomEntities( examples );
    var d1 = nlp.readDoc( ':-) one@two.com' );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'should detect an escaped literal', function () {
    const expectedEntities = [
      { value: 'literal', type: 'escaped-literal' },
    ];
    nlp.learnCustomEntities( [ { name: 'escaped-literal', patterns: [ '^literal' ] } ] );
    var d1 = nlp.readDoc( 'I am a literal!' );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( expectedEntities );
  } );

  it( 'with 0-custom entities, .out() should produce an empty array', function () {
    const nlp0 = winkNLP( model );
    var d1 = nlp0.readDoc( 'I am a literal!' );
    expect( d1.customEntities().out( its.detail ) ).to.deep.equal( [] );
  } );

  it( '.parentCustomEntity() must work correctly', function () {
    const config = { matchValue: false, usePOS: false, useEntity: true };
    const expectedEntities = [
      { value: 'one@two.com:-)', type: 'email-emoticon' },
      { value: '^', type: 'caret' },
      { value: 'thin', type: 'crust-type' },
      { value: 'ADJ Parrot', type: 'escaped-adj-parrot' },
      { value: '$5', type: 'entity-money' },
      { value: '^ carrot', type: 'caret-carrot' }
    ];
    nlp.learnCustomEntities( examples, config );
    var d1 = nlp.readDoc( s1 );
    expect( d1.tokens().itemAt( 0 ).parentCustomEntity().out( its.detail ) ).to.deep.equal( expectedEntities[ 0 ] );
    expect( d1.tokens().itemAt( 2 ).parentCustomEntity() ).to.deep.equal( undefined );
    expect( d1.tokens().itemAt( 22 ).parentCustomEntity().out( its.detail ) ).to.deep.equal( expectedEntities[ 5 ] );
  } );
} );
