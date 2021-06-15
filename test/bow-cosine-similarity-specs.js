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
var cosine = require( '../utilities/bow-cosine-similarity.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'bow-cosine-similarity normal behaviour', function () {
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
      expect( +cosine( test.whenInputIs.a, test.whenInputIs.b ).toFixed( 4 ) ).to.equal( test.expectedOutputIs );
    } );
  } );
} );
