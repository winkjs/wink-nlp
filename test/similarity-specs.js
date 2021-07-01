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
var similarity = require( '../utilities/similarity.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'bow-cosine normal behaviour', function () {
  var tests = [
    // Some similarity.
    { whenInputIs: { a: { the: 2, dog: 1, chased: 1, cat: 1 }, b: { the: 2, cat: 1, chased: 1, mouse: 1 } }, expectedOutputIs: 0.8571 },
    { whenInputIs: { a: { chased: 1, cat: 1 }, b: { chased: 1 } }, expectedOutputIs: 0.7071 },
    // Identical.
    { whenInputIs: { a: { the: 2, dog: 1, chased: 1, cat: 1 }, b: { the: 2, dog: 1, chased: 1, cat: 1 } }, expectedOutputIs: 1 },
    // No similarity.
    { whenInputIs: { a: { lion: 1, killed: 1, goat: 1 }, b: { dog: 1, chased: 1, cat: 1 } }, expectedOutputIs: 0 },
    // One of them is empty.
    { whenInputIs: { a: { }, b: { dog: 1, chased: 1, cat: 1 } }, expectedOutputIs: 0 },
    // Other one is empty.
    { whenInputIs: { a: { dog: 1, chased: 1, cat: 1 }, b: { } }, expectedOutputIs: 0 },
    // Both are empty!
    { whenInputIs: { a: { }, b: { } }, expectedOutputIs: 1 }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( +similarity.bow.cosine( test.whenInputIs.a, test.whenInputIs.b ).toFixed( 4 ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

describe( 'set-tversky normal behaviour', function () {
  const sa = [ 'dog', 'chased', 'cat' ];
  const sb = [ 'dog', 'ate' ];
  const sc = [ 'bird', 'flies' ];

  var tests = [
    // Some similarity.
    { whenInputIs: [ new Set( sa ), new Set( sb ), 1, 0 ], expectedOutputIs: 0.333333 },
    { whenInputIs: [ new Set( sa ), new Set( sb ), 0.75, 0.25 ], expectedOutputIs: 0.363636 },
    { whenInputIs: [ new Set( sa ), new Set( sb ), 0.5, 0.5 ], expectedOutputIs: 0.4 },
    { whenInputIs: [ new Set( sb ), new Set( sa ) ], expectedOutputIs: 0.4 },
    { whenInputIs: [ new Set( sa ), new Set( sb ), 0.25, 0.75 ], expectedOutputIs: 0.444444 },
    { whenInputIs: [ new Set( sa ), new Set( sb ), 0, 1 ], expectedOutputIs: 0.5 },
    // Identical.
    { whenInputIs: [ new Set( sa ), new Set( sa ), 1, 0 ], expectedOutputIs: 1 },
    { whenInputIs: [ new Set( sa ), new Set( sa ), 0.75, 0.25 ], expectedOutputIs: 1 },
    // No similarity.
    { whenInputIs: [ new Set( sa ), new Set( sc ), 1, 0 ], expectedOutputIs: 0 },
    { whenInputIs: [ new Set( sa ), new Set( sc ) ], expectedOutputIs: 0 },
    { whenInputIs: [ new Set( sa ), new Set( sc ), 0, 1 ], expectedOutputIs: 0 },
    // One of them is empty.
    { whenInputIs: [ new Set(  sa  ), new Set( [] ) ], expectedOutputIs: 0 },
    // // Other one is empty.
    { whenInputIs: [ new Set( [] ), new Set(  sa  ) ], expectedOutputIs: 0 },
    // Both are empty!
    { whenInputIs: [ new Set( [] ), new Set( [] ) ], expectedOutputIs: 1 },
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( +similarity.set.tversky( ...test.whenInputIs ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );

describe( 'set-tversky error behaviour', function () {
  const sa = [ 'dog', 'chased', 'cat' ];
  const sb = [ 'dog', 'ate' ];

  var tests = [
    { whenInputIs: [ new Set( sa ), new Set( sb ), -1, 0 ], expectedOutputIs: 'throw error' },
    { whenInputIs: [ new Set( sa ), new Set( sb ), 0, -1 ], expectedOutputIs: 'throw error' },
    { whenInputIs: [ new Set( sa ), new Set( sb ), -1, -1 ], expectedOutputIs: 'throw error' },
  ];

  tests.forEach( function ( test ) {
    it( 'should ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( similarity.set.tversky.bind( null, ...test.whenInputIs ) ).to.throw( 'wink-nlp: tversky requires aplha & beta to be positive numbers.' );
    } );
  } );
} );

describe( 'set-oo normal behaviour', function () {
  var tests = [
    // Some similarity.
    { whenInputIs: { a: [ 'the', 'dog', 'chased', 'the', 'cat' ], b: [ 'the', 'cat', 'chased', 'the', 'mouse' ] }, expectedOutputIs: 0.75 },
    { whenInputIs: { a: [ 'the', 'dog', 'chased' ], b: [ 'the', 'cat', 'chased', 'the', 'mouse' ] }, expectedOutputIs: 0.5774 },
    // Identical.
    { whenInputIs: { a: [ 'the', 'dog', 'chased', 'the', 'cat' ], b: [ 'the', 'dog', 'chased', 'the', 'cat' ] }, expectedOutputIs: 1 },
    // No similarity.
    { whenInputIs: { a: [ 'tiger', 'killed', 'goat' ], b: [ 'dog', 'ate', 'food' ] }, expectedOutputIs: 0 },
    // One of them is empty.
    { whenInputIs: { a: [], b: [ 'dog', 'ate', 'food' ] }, expectedOutputIs: 0 },
    // Other one is empty.
    { whenInputIs: { a: [ 'dog', 'ate', 'food' ], b: [] }, expectedOutputIs: 0 },
    // Both are empty!
    { whenInputIs: { a: [], b: [] }, expectedOutputIs: 1 }
  ];

  tests.forEach( function ( test ) {
    it( 'should return ' + JSON.stringify( test.expectedOutputIs ) + ' if the input is ' + JSON.stringify( test.whenInputIs ), function () {
      expect( +similarity.set.oo( new Set( test.whenInputIs.a ), new Set( test.whenInputIs.b ) ).toFixed( 4 ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );
