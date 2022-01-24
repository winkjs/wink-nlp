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
var composePatterns = require( '../src/compose-patterns.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'composePatterns()', function () {
  var input = '[$$DAY|$$MONTH_NUMBER|$$NUMBER] [|-] [$$TIME_UNITS.GE.DAY] [|ago]';
  var expectedOutput = [
    [ '$$DAY', '$$TIME_UNITS.GE.DAY' ],
    [ '$$DAY', '$$TIME_UNITS.GE.DAY', 'ago' ],
    [ '$$DAY', '-', '$$TIME_UNITS.GE.DAY' ],
    [ '$$DAY', '-', '$$TIME_UNITS.GE.DAY', 'ago' ],
    [ '$$MONTH_NUMBER', '$$TIME_UNITS.GE.DAY' ],
    [ '$$MONTH_NUMBER', '$$TIME_UNITS.GE.DAY', 'ago' ],
    [ '$$MONTH_NUMBER', '-', '$$TIME_UNITS.GE.DAY' ],
    [ '$$MONTH_NUMBER', '-', '$$TIME_UNITS.GE.DAY', 'ago' ],
    [ '$$NUMBER', '$$TIME_UNITS.GE.DAY' ],
    [ '$$NUMBER', '$$TIME_UNITS.GE.DAY', 'ago' ],
    [ '$$NUMBER', '-', '$$TIME_UNITS.GE.DAY' ],
    [ '$$NUMBER', '-', '$$TIME_UNITS.GE.DAY', 'ago' ]
  ];
  it( 'should return all possible patterns for input\n\t' + input, function () {
    expect( composePatterns( input ) ).to.deep.equal( expectedOutput );
  } );

  it( 'should return empty array on null input', function () {
    expect( composePatterns( null ) ).to.deep.equal( [] );
  } );

  it( 'should return [ [ \'text\' ] ] for input "text"', function () {
    expect( composePatterns( 'text' ) ).to.deep.equal( [ [ 'text' ] ] );
  } );

  it( 'should issue warning when patterns > 512', function () {
    const text = '[a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d]';
    expect( composePatterns( text ).length ).to.equal( 1024 );
  } );

  it( 'should issue error when patterns > 65536', function () {
    const text = '[a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b|c|d] [a|b]';
    expect( composePatterns( text ).length ).to.equal( 131072 );
  } );
} );
