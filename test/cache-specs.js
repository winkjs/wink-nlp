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

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var model = require( './test-model/model.js' );
var cache = require( '../src/cache.js' )( model.core(), model.featureFn );


var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'cache', function () {
  it( 'property() should return null in case of unknown property', function () {
    expect( cache.property( 21, 'unk' ) ).to.equal( null );
  } );

  it( 'posOf() should return 6 in case of lexeme — the', function () {
    expect( cache.posOf( cache.lookup( 'the' )[ 0 ], 'pos' ) ).to.equal( 6 );
  } );

  it( 'currentSize() should current size of the lexicon', function () {
    expect( cache.currentSize() ).to.equal( 84962 );
  } );

  it( 'should compute oov number\'s pos as NUM', function () {
    cache.add( '333666999', 2 );
    expect( cache.posOf( cache.lookup( '333666999' )[ 0 ], 'pos' ) ).to.equal( 9 );
  } );

  it( 'should map spelling correctly', function () {
    cache.add( 'somejunking', 1 );
    expect( cache.value( cache.mappedSpelling( cache.lookup( 'organised' )[ 0 ] ) ) ).to.equal( 'organized' );
    expect( cache.value( cache.mappedSpelling( cache.lookup( 'somejunking' )[ 0 ] ) ) ).to.equal( 'somejunking' );
  } );

  it( 'should falg same pos correctly', function () {
    expect( cache.hasSamePOS( 'organized', 'ADJ' ) ).to.equal( true );
    expect( cache.hasSamePOS( 'organized', 'VERB' ) ).to.equal( true );
    expect( cache.hasSamePOS( 'somejunking', 'ADJ' ) ).to.equal( false );
    expect( cache.hasSamePOS( 'superjunking', 'ADJ' ) ).to.equal( false );
    expect( cache.hasSamePOS( 'can\'t', 'ADJ' ) ).to.equal( false );
  } );
} );
