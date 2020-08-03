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
var locate = require( '../src/locate.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'Locating an item in spans', function () {
  var spans = [ [ 2, 3 ], [ 8, 9 ], [ 17, 18 ], [ 21, 21 ], [ 24, 27 ], [ 33, 38 ] ];
  it( 'Item beyond the left edge should return -0.5', function () {
    expect( locate( 1, spans ) ).equals( -0.5 );
  } );

  it( 'Item at the left-most span should return 0', function () {
    expect( locate( 2, spans ) ).equals( 0 );
  } );

  it( 'Item between 0 & 1 should return 0.5', function () {
    expect( locate( 4, spans ) ).equals( 0.5 );
  } );

  it( 'Item at 1 should return 1', function () {
    expect( locate( 9, spans ) ).equals( 1 );
  } );

  it( 'Item between 1 & 2 should return 1.5', function () {
    expect( locate( 10, spans ) ).equals( 1.5 );
  } );

  it( 'Item at 2 should return 2', function () {
    expect( locate( 17, spans ) ).equals( 2 );
  } );

  it( 'Item between 2 & 3 should return 2.5', function () {
    expect( locate( 19, spans ) ).equals( 2.5 );
  } );

  it( 'Item at 3 should return 3', function () {
    expect( locate( 21, spans ) ).equals( 3 );
  } );

  it( 'Item between 3 & 4 should return 3.5', function () {
    expect( locate( 22, spans ) ).equals( 3.5 );
  } );

  it( 'Item at 4 should return 4', function () {
    expect( locate( 26, spans ) ).equals( 4 );
  } );

  it( 'Item between 4 & 4 should return 4.5', function () {
    expect( locate( 28, spans ) ).equals( 4.5 );
  } );

  it( 'Item at 5 should return 5', function () {
    expect( locate( 38, spans ) ).equals( 5 );
  } );

  it( 'Item beyond the right edge should return 5.5', function () {
    expect( locate( 48, spans ) ).equals( 5.5 );
  } );
} );
