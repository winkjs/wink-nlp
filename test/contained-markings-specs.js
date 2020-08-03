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
var containedMarkings = require( '../src/contained-markings.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'Locating an markings in a span', function () {
  var markings = [ [ 2, 3 ], [ 8, 9 ], [ 17, 18 ], [ 21, 21 ], [ 24, 27 ], [ 33, 38 ] ];
  it( 'span completely beyond the left edge should return null', function () {
    expect( containedMarkings( markings, 0, 1 ) ).deep.equals( null );
  } );

  it( 'span partly beyond the left edge should return l/r as 0/0', function () {
    expect( containedMarkings( markings, 0, 3 ) ).deep.equals( { left: 0, right: 0 } );
    expect( containedMarkings( markings, 0, 6 ) ).deep.equals( { left: 0, right: 0 } );
  } );

  it( 'span within boundaries but in gap area should return null', function () {
    expect( containedMarkings( markings, 4, 7 ) ).deep.equals( null );
  } );

  it( 'span within boundaries and covering 2 entities area should return l/r as 1/2', function () {
    expect( containedMarkings( markings, 7, 19 ) ).deep.equals( { left: 1, right: 2 } );
    expect( containedMarkings( markings, 8, 18 ) ).deep.equals( { left: 1, right: 2 } );
  } );

  it( 'span partly beyond the right edge should return l/r as 5/5', function () {
    expect( containedMarkings( markings, 30, 40 ) ).deep.equals( { left: 5, right: 5 } );
    expect( containedMarkings( markings, 33, 40 ) ).deep.equals( { left: 5, right: 5 } );
  } );

  it( 'span completely beyond the right edge should return null', function () {
    expect( containedMarkings( markings, 40, 51 ) ).deep.equals( null );
  } );

  it( 'span is undefined, it should return null', function () {
    expect( containedMarkings( undefined, 0, 1 ) ).deep.equals( null );
  } );

  it( 'start is undefined, it should return null', function () {
    expect( containedMarkings( markings, undefined, 1 ) ).deep.equals( null );
  } );

  it( 'end is undefined, it should return null', function () {
    expect( containedMarkings( markings, 0, undefined ) ).deep.equals( null );
  } );

  it( 'start & end completely conatined in span should return null', function () {
    expect( containedMarkings( markings, 25, 26 ) ).deep.equals( null );
  } );
} );
