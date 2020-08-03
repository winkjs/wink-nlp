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

// var fsm1 = FSM(); // eslint-disable-line new-cap
// var fsm2 = FSM(); // eslint-disable-line new-cap
// var fsm3 = FSM(); // eslint-disable-line new-cap
// var fsm4 = FSM(); // eslint-disable-line new-cap
// var fsm5 = FSM(); // eslint-disable-line new-cap

describe( 'simpleFSM()', function () {
  describe( 'given the "patterns" containing various edge cases', function () {
    const patterns = [
      { name: 'Pattern-1', pattern: [ 'trumps', 'united', 'states', 'of', 'america' ] },
      { name: 'P1-Left-Edge-1', pattern: [ 'trumps' ] },
      { name: 'P1-Left-Edge-2', pattern: [ 'trumps', 'united' ] },
      { name: 'P1-middle-1-and-2more', pattern: [ 'united' ] },
      { name: 'P1-middle-2', pattern: [ 'united', 'states' ] },
      { name: 'P1-middle-3', pattern: [ 'united', 'states', 'of' ] },
      { name: 'P1-Right-Edge-2', pattern: [ 'of', 'america' ] },
      { name: 'P1-Right-Edge-1', pattern: [ 'america' ] },
      { name: 'Independent-Single', pattern: [ 'india' ] },
      { name: 'Independent-Double', pattern: [ 'united', 'arab' ] },
      // A pattern type already defined earlier.
      { name: 'Independent-Single', pattern: [ 'china' ] },
      { name: 'Independent-Double', pattern: [ 'super', 'league' ] },
      { name: 'P2-Left-Edge-1', pattern: [ 'manchester' ] },
      { name: 'Pattern-2-Overlaps-P2', pattern: [ 'manchester', 'united' ] },
      { name: 'Pattern-3-Overlaps-P2',  pattern: [ 'united', 'kingdom' ] },
      { name: 'Pattern-4-Overlaps-P3',  pattern: [ 'kingdom', 'of', 'dreams' ] },
    ];
    var fsm = FSM(); // eslint-disable-line new-cap

    // learn() test cases.
    it( 'learn() should return the number of named patterns on training', function () {
      expect( fsm.learn( patterns ) ).to.equal( 14 );
    } );

    // recognize() test cases.
    it( 'recognize() should detect 5-patterns — with other tokens in between', function () {
      const text = 'I was the trumps united states of america x  india x united arab x manchester united kingdom of dreams';
      const detectedPatterns = [
        [ 3, 7, 'Pattern-1' ],
        [ 9, 9, 'Independent-Single' ],
        [ 11, 12, 'Independent-Double' ],
        [ 14, 15, 'Pattern-2-Overlaps-P2' ],
        [ 16, 18, 'Pattern-4-Overlaps-P3' ] ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect 5-patterns — with NO tokens in between', function () {
      const text = 'trumps united states of america india united arab manchester united kingdom of dreams';
      const detectedPatterns = [
        [ 0, 4, 'Pattern-1' ],
        [ 5, 5, 'Independent-Single' ],
        [ 6, 7, 'Independent-Double' ],
        [ 8, 9, 'Pattern-2-Overlaps-P2' ],
        [ 10, 12, 'Pattern-4-Overlaps-P3' ] ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect 1-pattern in "united" — eos/otherwise i.e. contained case!', function () {
      const text = 'united';
      const detectedPatterns = [
        [ 0, 0, 'P1-middle-1-and-2more' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect single pattern in "united states" — eos/otherwise i.e. contained case!', function () {
      const text = 'united states';
      const detectedPatterns = [
        [ 0, 1, 'P1-middle-2' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect single pattern in "united states of" — eos/otherwise i.e. contained case!', function () {
      const text = 'united states of';
      const detectedPatterns = [
        [ 0, 2, 'P1-middle-3' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect singe pattern in "super league" — no overlap case!', function () {
      const text = 'super league';
      const detectedPatterns = [
        [ 0, 1, 'Independent-Double' ],
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect single pattern in "india" — no overlap case!', function () {
      const text = 'india';
      const detectedPatterns = [
        [ 0, 0, 'Independent-Single' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect 2-pattern in "india india" — no overlap/no in between token case!', function () {
      const text = 'india india';
      const detectedPatterns = [
        [ 0, 0, 'Independent-Single' ],
        [ 1, 1, 'Independent-Single' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );

    it( 'recognize() should detect "trumps (P1-Left-Edge-1)" & "trumps united (P1-Left-Edge-2)" as patterns', function () {
      const text = 'trumps trumps united states fail';
      const detectedPatterns = [
        [ 0, 0, 'P1-Left-Edge-1' ],
        [ 1, 2, 'P1-Left-Edge-2' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );
  } ); // describe( 'given the "patterns" containing various edge cases'...

  describe( 'given a learning from a pattern', function () {
    const patterns = [
      { name: 'Pattern-1', pattern: [ 'trumps', 'united', 'states', 'of', 'america' ] },
      { name: 'P1-Left-Edge-1', pattern: [ 'trumps' ] },
      { name: 'P1-Left-Edge-2', pattern: [ 'trumps', 'united' ] },
      { name: 'P1-middle-1-and-2more', pattern: [ 'united' ] },
      { name: 'P1-middle-2', pattern: [ 'united', 'states' ] },
      { name: 'P1-middle-3', pattern: [ 'united', 'states', 'of' ] },
      { name: 'P1-Right-Edge-2', pattern: [ 'of', 'america' ] },
      { name: 'P1-Right-Edge-1', pattern: [ 'america' ] },
      { name: 'Independent-Single', pattern: [ 'india' ] },
      { name: 'Independent-Double', pattern: [ 'united', 'arab' ] },
      // A pattern type already defined earlier.
      { name: 'Independent-Single', pattern: [ 'china' ] },
      { name: 'Independent-Double', pattern: [ 'super', 'league' ] },
      { name: 'P2-Left-Edge-1', pattern: [ 'manchester' ] },
      { name: 'Pattern-2-Overlaps-P2', pattern: [ 'manchester', 'united' ] },
      { name: 'Pattern-3-Overlaps-P2',  pattern: [ 'united', 'kingdom' ] },
      { name: 'Pattern-4-Overlaps-P3',  pattern: [ 'kingdom', 'of', 'dreams' ] },
    ];
    var json;

    // learn() test cases.
    it( 'exportJSON() should export JSON', function () {
      var fsm = FSM(); // eslint-disable-line new-cap
      expect( fsm.learn( patterns ) ).to.equal( 14 );
      json = fsm.exportJSON();
    } );

    // recognize() test cases.
    it( 'recognize() should work after importing the exported model', function () {
      var fsm = FSM(); // eslint-disable-line new-cap
      const tokens = [  'I',
                        'was',
                        'the',
                        'trumps',
                        'united',
                        'states',
                        'of',
                        'america',
                        'x',
                        'india',
                        'x',
                        'united',
                        'arab',
                        'x',
                        'manchester',
                        'united',
                        'kingdom',
                        '\n', /* to test that a new line char between entity's tokens is ignored */
                        'of',
                        'dreams' ];
      const detectedPatterns = [
        [ 3, 7, 'Pattern-1' ],
        [ 9, 9, 'Independent-Single' ],
        [ 11, 12, 'Independent-Double' ],
        [ 14, 15, 'Pattern-2-Overlaps-P2' ],
        [ 16, 19, 'Pattern-4-Overlaps-P3' ] ]; // pattern span covers the new line char.
      fsm.importJSON( json );
      expect( fsm.recognize( tokens ) ).to.deep.equal( detectedPatterns );
    } );

    // export an empty model
    it( 'emptyModelJSON() should export an empty model', function () {
      var fsm = FSM(); // eslint-disable-line new-cap
      expect( fsm.emptyModelJSON() ).to.deep.equal( '[100,0,{"0":{}},{},{},{}]' );
    } );
  } );

  describe( 'given the special input pattern', function () {
    it( 'learning should cover the shared path case', function () {
      var fsm = FSM(); // eslint-disable-line new-cap
      fsm.learn( input );
    } );
  } );

  describe( 'given the "patternsInIssue50" input', function () {
    const patternsInIssue50 = [
      { name: 'news', pattern: [ 'm', 'u', 'n' ] },
      { name: 'city', pattern: [ 'm' ] },
    ];

    var fsm = FSM(); // eslint-disable-line new-cap

    it( 'learn() should return the number of named patterns on training', function () {
      expect( fsm.learn( patternsInIssue50 ) ).to.equal( 2 );
    } );

    it( 'recognize() should detect issue #50 patterns correctly', function () {
      const text = 'm m u';
      const detectedPatterns = [
        [ 0, 0, 'city' ],
        [ 1, 1, 'city' ]
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );
  } );

  describe( 'given the "patterns4Mark" to test mark feature', function () {
    const patterns4Mark = [
      { name: 'pn', pattern: [ 'Mr.', 'Barak', 'Obama' ], mark: [ 1, 2 ] },
      // Different marks for the same entity in following rows:
      { name: 'pn-1', pattern: [ 'Mr.', 'George', 'Washington', 'Bush' ], mark: [ 1, 3 ] },
      { name: 'pn-1', pattern: [ 'Mr.', 'Richard', 'Nixon' ], mark: [ 2, 2 ] }
    ];

    var fsm = FSM(); // eslint-disable-line new-cap

    it( 'learn() should return the number of named patterns on training', function () {
      expect( fsm.learn( patterns4Mark ) ).to.equal( 2 );
    } );

    it( 'recognize() should detect the pattern boundaries as per mark param', function () {
      const text = 'Mr. George Washington Bush was preceded by Mr. Barak Obama and succeeded Mr. Richard Nixon';
      const detectedPatterns = [
        [ 1, 3, 'pn-1' ],
        [ 8, 9, 'pn' ],
        [ 14, 14, 'pn-1',  ],
      ];
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );
  } );


  describe( 'given the "patterns4OnDetect" to test "setOnPatternDetectionFn" handler', function () {
    const patterns4OnDetect = [
      { name: 'pn', pattern: [ 'Mr.', 'Barak', 'Obama' ], mark: [ 1, 2 ], customProperty: 33 },
      { name: '0', pattern: [ 'Mr.', 'George', 'Washington', 'Bush' ], mark: [ 1, 2 ] }
    ];

    var fsm = FSM(); // eslint-disable-line new-cap

    it( 'learn() should return the number of named patterns on training', function () {
      expect( fsm.learn( patterns4OnDetect ) ).to.equal( 2 );
    } );

    it( 'recognize() should use "custom property" via handler & should ignore "0"', function () {
      const text = 'Mr. George Washington Bush was preceded by Mr. Barak Obama';
      const detectedPatterns = [
        // [ '0', 1, 2 ], // the ignore pattern!
        [ 8, 9, 'pn', 33 ]
      ];
      expect( fsm.setOnPatternDetectionFn( 3 ) ).to.equal( false );
      expect( fsm.setOnPatternDetectionFn( ( match, customProperty ) => ( match.push( customProperty ) ) ) ).to.equal( true );
      expect( fsm.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );
  } );

  describe( 'given the patterns for "compose patterns" & "pattern swap"', function () {
    const patterns4CP = [
      { name: 'greetings', pattern: '[good] [morning|evening|afternoon]' }
    ];

    var fsm1 = FSM(); // eslint-disable-line new-cap

    it( 'fsm1.learn() should return the number of composed patterns on training', function () {
      expect( fsm1.learn( patterns4CP ) ).to.equal( 1 );
    } );

    it( 'fsm1.recognize() should detect the composed patterns', function () {
      const text = 'say good morning in morning and not good evening';
      const detectedPatterns = [
        [ 1, 2, 'greetings' ],
        [ 7, 8, 'greetings' ]
      ];
      expect( fsm1.recognize( text.split( /\s+/ ) ) ).to.deep.equal( detectedPatterns );
    } );


    const patterns4PS = [
      { name: 'fun', pattern: '[greetings] [to|and] [greetings]' },
      { name: 'number', pattern: [ 'isNumber' ] }
    ];

    var fsm2 = FSM(); // eslint-disable-line new-cap

    it( 'fsm2.learn() should return the number of second-pass named patterns on training', function () {
      expect( fsm2.learn( patterns4PS ) ).to.equal( 2 );
      fsm2.printModel();
    } );


    it( 'recognize() should detect patterns defined for second-pass using "swap" & "on token transformation"', function () {
      const text = 'good funny morning 3.3 good evening to good evening good evening and good morning';
      const detectedPatterns = [
        [ 3, 3, 'number' ],
        [ 4, 8, 'fun' ],
        [ 9, 13, 'fun',  ]
      ];
      const tf = function ( token ) {
        if ( !isNaN( +token ) ) return 'isNumber';
        return token;
      };

      fsm2.setPatternSwap( fsm1.recognize( text.split( /\s+/ ) ) );
      expect( fsm2.recognize( text.split( /\s+/ ), tf ) ).to.deep.equal( detectedPatterns );
      // Test substitution rest functionality.
      expect( fsm2.setPatternSwap( ) ).to.deep.equal( undefined );
      expect( fsm2.recognize( text.split( /\s+/ ) ) ).to.deep.equal( [] );
    } );
  } );

} );
