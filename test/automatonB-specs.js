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
var FSM = require( '../src/automaton.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

const input = require( './data/input.json' );

var json;

describe( 'automaton', function () {
  it( 'learning should return the correct number', function () {
    var fsm = FSM(); // eslint-disable-line new-cap
    expect( fsm.learn( input ) ).to.equal( 32 );
    json = fsm.exportJSON();
  } );

  it( 'importJSON() should import correctly', function () {
    var fsm = FSM(); // eslint-disable-line new-cap
    fsm.importJSON( json );
    expect( fsm.exportJSON() ).to.equal( json );
  } );

  it( 'emptyModelJSON() should export an empty model', function () {
    var fsm = FSM(); // eslint-disable-line new-cap
    expect( fsm.emptyModelJSON() ).to.deep.equal( '[100,0,{"0":{}},{},{},{}]' );
    fsm.printModel();
  } );
} );
