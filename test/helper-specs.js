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

/* eslint-disable no-sync */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var helper = require( '../src/helper.js' );


var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'isObject', function () {
  var tests = [
    { whenInputIs: 'UPPERCASE', expectedOutputIs: false },
    { whenInputIs: 1, expectedOutputIs: false },
    { whenInputIs: null, expectedOutputIs: false },
    { whenInputIs: undefined,  expectedOutputIs: false },
    { whenInputIs: {}, expectedOutputIs: true },
    { whenInputIs: new Set( [ 1, 2, 3, 4 ] ), expectedOutputIs: false },
    { whenInputIs: [ 1, 2, 3, 4 ], expectedOutputIs: false },
    { whenInputIs: [ ], expectedOutputIs: false },
    { whenInputIs: { ietms: [ 1, 2, 3 ] }, expectedOutputIs: true },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + '\n\tif the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( helper.isObject( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

describe( 'isArray', function () {
  var tests = [
    { whenInputIs: 'UPPERCASE', expectedOutputIs: false },
    { whenInputIs: 1, expectedOutputIs: false },
    { whenInputIs: null, expectedOutputIs: false },
    { whenInputIs: undefined,  expectedOutputIs: false },
    { whenInputIs: {}, expectedOutputIs: false },
    { whenInputIs: new Set( [ 1, 2, 3, 4 ] ), expectedOutputIs: false },
    { whenInputIs: [ 1, 2, 3, 4 ], expectedOutputIs: true },
    { whenInputIs: [ ], expectedOutputIs: true },
    { whenInputIs: [ {} ], expectedOutputIs: true },
  ];
  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + '\n\tif the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( helper.isArray( test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

describe( 'isFiniteInteger', function () {
  var tests = [
    { expectedOutputIs: false, whenInputIs: undefined },
    { expectedOutputIs: false, whenInputIs: null },
    { expectedOutputIs: false, whenInputIs: Infinity },
    { expectedOutputIs: false, whenInputIs: -1.1 },
    { expectedOutputIs: false, whenInputIs: 1.00001 },
    { expectedOutputIs: false, whenInputIs: {} },
    { expectedOutputIs: false, whenInputIs: [] },
    { expectedOutputIs: true, whenInputIs: 1 },
    { expectedOutputIs: true, whenInputIs: 999999 },
    { expectedOutputIs: true, whenInputIs: -999999 }
  ];
  tests.forEach( function ( t ) {
    it( 'should return ' + JSON.stringify( t.expectedOutputIs ) + '\n\tif the input is ' + JSON.stringify( t.whenInputIs ), function () {
      expect( helper.isFiniteInteger( t.whenInputIs ) ).to.equal( t.expectedOutputIs );
    } );
  } );
} );

describe( 'isIntegerArray', function () {
  var tests = [
    { expectedOutputIs: false, whenInputIs: undefined },
    { expectedOutputIs: false, whenInputIs: null },
    { expectedOutputIs: false, whenInputIs: [] },
    { expectedOutputIs: false, whenInputIs: [ -1.1 ] },
    { expectedOutputIs: false, whenInputIs: [ 1.00001 ] },
    { expectedOutputIs: false, whenInputIs: [ {} ] },
    { expectedOutputIs: false, whenInputIs: [ [] ] },
    { expectedOutputIs: false, whenInputIs: [ 1, 2, [] ] },
    { expectedOutputIs: false, whenInputIs: [ 1, 2, {} ] },
    { expectedOutputIs: false, whenInputIs: [ 1, 2, 1.1 ] },
    { expectedOutputIs: true, whenInputIs: [ 1 ] },
    { expectedOutputIs: true, whenInputIs: [ 999999 ] },
    { expectedOutputIs: true, whenInputIs: [ -999999 ] },
    { expectedOutputIs: true, whenInputIs: [ -999999, 1, 2 ] }
  ];
  tests.forEach( function ( t ) {
    it( 'should return ' + JSON.stringify( t.expectedOutputIs ) + '\n\tif the input is ' + JSON.stringify( t.whenInputIs ), function () {
      expect( helper.isIntegerArray( t.whenInputIs ) ).to.equal( t.expectedOutputIs );
    } );
  } );
} );
