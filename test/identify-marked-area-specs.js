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
var ima = require( '../src/identify-marked-area.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'Identify marked area', function () {
  // Assume the entity length is 6 tokens and the area has
  // to be decided by different values of `mark`. Note `mark`'s
  // first & last indexes are 0 based when counting forward;
  // and when counting backwards, `-1` refers to last and `-2`
  // to last but one and so on.
  const length = 6;

  it( 'Left edge to right edge should return the entire area', function () {
    // Counting forward.
    // Note: the values in expect's comments are without the `lastIndex` manoeuvre to
    // bring clarity in the test cases. Refer to the source file under test for details.
    expect( ima( [ 0, 5 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
    // Counting backwards corresponding to the above.
    expect( ima( [ -6, -1 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
    // Mix of backwards & forward.
    expect( ima( [ -6, 5 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
    expect( ima( [ 0, -1 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
  } );

  it( 'Single values at left edge, middle(2nd) & right edge should yield [0, 0], [2, 2], & [5, 5]', function () {
    // Counting forward.
    expect( ima( [ 0, 0 ], length ) ).deep.equals( [ 0, 5 ] ); // [ 0, 0 ]
    expect( ima( [ 2, 2 ], length ) ).deep.equals( [ 2, 3 ] ); // [ 2, 2 ]
    expect( ima( [ 5, 5 ], length ) ).deep.equals( [ 5, 0 ] ); // [ 5, 5 ]
    // Counting backwards corresponding to the above.
    expect( ima( [ -6, -6 ], length ) ).deep.equals( [ 0, 5 ] ); // [ 0, 0 ]
    expect( ima( [ -4, -4 ], length ) ).deep.equals( [ 2, 3 ] ); // [ 2, 2 ]
    expect( ima( [ -1, -1 ], length ) ).deep.equals( [ 5, 0 ] ); // [ 5, 5 ]
    // Mix of backwards & forward.
    expect( ima( [ -6, 0 ], length ) ).deep.equals( [ 0, 5 ] ); // [ 0, 0 ]
    expect( ima( [ -4, 2 ], length ) ).deep.equals( [ 2, 3 ] ); // [ 2, 2 ]
    expect( ima( [ 2, -4 ], length ) ).deep.equals( [ 2, 3 ] ); // [ 2, 2 ]
    expect( ima( [ 5, -1 ], length ) ).deep.equals( [ 5, 0 ] ); // [ 5, 5 ]
    expect( ima( [ -1, 5 ], length ) ).deep.equals( [ 5, 0 ] ); // [ 5, 5 ]
  } );

  it( 'Out of bound values should yield the entire area i.e. [0, 5]', function () {
    // Counting forward beyond limits
    expect( ima( [ 20, 500 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
    // Going backwards beyond limits
    expect( ima( [ -10, 0 ], length ) ).deep.equals( [ 0, 5 ] ); // [ 0, 0 ]
    expect( ima( [ -10, -1 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
    expect( ima( [ -10, -7 ], length ) ).deep.equals( [ 0, 0 ] ); // [ 0, 5 ]
  } );
} );
