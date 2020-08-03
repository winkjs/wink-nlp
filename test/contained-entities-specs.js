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
var containedEntities = require( '../src/contained-entities.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'Locating an item in entities', function () {
  var entities = [ [ 2, 3 ], [ 8, 9 ], [ 17, 18 ], [ 21, 21 ], [ 24, 27 ], [ 33, 38 ] ];
  it( 'sentence completely beyond the left edge should return []', function () {
    expect( containedEntities( entities, 0, 1 ) ).deep.equals( [] );
  } );

  it( 'sentence partly beyond the left edge should return [ 0 ]', function () {
    expect( containedEntities( entities, 0, 3 ) ).deep.equals( [ 0 ] );
    expect( containedEntities( entities, 0, 6 ) ).deep.equals( [ 0 ] );
  } );

  it( 'sentence within boundaries but in gap area should return []', function () {
    expect( containedEntities( entities, 4, 7 ) ).deep.equals( [] );
  } );

  it( 'sentence within boundaries and covering 2 entities area should return [ 1, 2 ]', function () {
    expect( containedEntities( entities, 7, 19 ) ).deep.equals( [ 1, 2 ] );
    expect( containedEntities( entities, 8, 18 ) ).deep.equals( [ 1, 2 ] );
  } );

  it( 'sentence partly beyond the right edge should return [ 5 ]', function () {
    expect( containedEntities( entities, 30, 40 ) ).deep.equals( [ 5 ] );
    expect( containedEntities( entities, 33, 40 ) ).deep.equals( [ 5 ] );
  } );

  it( 'sentence completely beyond the right edge should return []', function () {
    expect( containedEntities( entities, 40, 51 ) ).deep.equals( [] );
  } );
} );
