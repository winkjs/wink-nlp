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
var search = require( '../src/search.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'Searching an item in spans', function () {
  var spans = [ [ 2, 3 ], [ 8, 9 ], [ 17, 18 ], [ 21, 21 ], [ 24, 27 ], [ 33, 38 ] ];
  it( 'Item beyond the left edge should retun null', function () {
    expect( search( 1, spans ) ).equals( null );
  } );

  it( 'Item not in any span but on left side should return null', function () {
    expect( search( 4, spans ) ).equals( null );
  } );

  it( 'Item not in any span but on right side should return null', function () {
    expect( search( 28, spans ) ).equals( null );
  } );

  it( 'Item beyond the right edge should retun null', function () {
    expect( search( 39, spans ) ).equals( null );
  } );

  it( 'Item found in left-side span should retun correct index', function () {
    expect( search( 8, spans ) ).equals( 1 );
  } );

  it( 'Item found in right-side span should retun correct index', function () {
    expect( search( 25, spans ) ).equals( 4 );
  } );

  it( 'Item found in middle-span should retun correct index', function () {
    expect( search( 17, [ [ 2, 3 ], [ 8, 9 ], [ 17, 18 ], [ 21, 21 ], [ 24, 27 ] ] ) ).equals( 2 );
  } );
} );
