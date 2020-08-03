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

/* eslint-disable no-console */

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var winkNLP = require( '../src/wink-nlp.js' );
var its = require( '../src/its.js' );
var as = require( '../src/as.js' );
var model = require( './test-model/model.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'APIs — B', function () {
  var nlp = winkNLP( model );
  var t0 = 'F-16/F-15 not manufactured by AT&T? March 21st is 1 by five:p#fun!';
  var t1 = '@superman: hit me up on my email r2d2@gmail.com. we will plan party 🎉';

  var examples = [
    { name: 'orgs', patterns: [ 'at&t' ] },
    { name: 'fighters', patterns: [ 'F-16', 'F-15' ] },
    { name: 'email-2', patterns: [ 'email EMAIL' ] },
    { name: 'plan-party', patterns: [ 'plan party' ] },
  ];

  nlp.learnCustomEntities( examples );

  var docs = [];
  docs.push( nlp.readDoc( t0 ) );
  docs.push( nlp.readDoc( t1 )  );

  // Span of each document.
  var docSpans = [
    [ 0, 16 ],
    [ 0, 14 ]
  ];

  // Negation flag of each document.
  var docNegFlag = [
    true,
    false
  ];

  // Document-wise sentences.
  var sentences = [
   [ 'F-16/F-15 not manufactured by AT&T?', 'March 21st is 1 by five:p#fun!' ],
   [ '@superman: hit me up on my email r2d2@gmail.com.', 'we will plan party 🎉' ]
  ];

  // Document-wise span of sentences.
  var sentSpans = [
    [ [ 0, 7 ], [ 8, 16 ] ],
    [ [ 0, 9 ], [ 10, 14 ] ]
  ];

  // Document-wise sentences' negation flag.
  var sentNegFlag = [
    [ true, false ],
    [ false, false ]
  ];

  // Document-wise entities.
  var entities = [
    [ [], [ 'March 21st', '1', 'five', ':p', '#fun' ] ],
    [ [ '@superman', 'r2d2@gmail.com' ], [ '🎉' ] ]
  ];

  // Docs[ 0 ] entities and related details.
  const DATE = 'DATE';
  const CARDINAL = 'CARDINAL';
  var d0 = Object.create( null );
  d0[ DATE ] = [ 'March 21st' ];
  d0[ CARDINAL ] = [ '1', 'five' ];
  d0.entityTypeFT = [ [ CARDINAL, 2 ], [ DATE, 1 ] ];
  d0.entitySpans = [ [ 8, 9 ], [ 11, 11 ], [ 13, 13 ], [ 14, 14 ], [ 15, 15 ] ];
  const d0CardinalDetails = [ { value: '1', type: 'CARDINAL' }, { value: 'five', type: 'CARDINAL' } ];
  // Entity filter for dates & cardinal.
  var cardinals = ( ( e ) => ( ( e ) ? ( e.out( its.type ) === CARDINAL ) : false ) );
  var dates = ( ( e ) => ( ( e ) ? ( e.out( its.type ) === DATE ) : false ) );

  // Custom entities.
  var customEntities = [
    [ [ 'F-16', 'F-15', 'AT&T' ], [] ],
    [ [ 'email r2d2@gmail.com' ], [ 'plan party' ] ]
  ];

  var d0ce = Object.create( null );
  d0ce.orgs = [ 'AT&T' ];
  d0ce.fighters = [ 'F-16', 'F-15' ];
  d0ce.entityTypeFT = [ [ 'fighters', 2 ], [ 'orgs', 1 ] ];
  d0ce.entitySpans = [ [ 0, 0 ], [ 2, 2 ], [ 6, 6 ] ];
  const d0ceFighetrsDetails = [ { value: 'F-16', type: 'fighters' }, { value: 'F-15', type: 'fighters' } ];
  var fighters = ( ( e ) => ( ( e ) ? ( e.out( its.type ) === 'fighters' ) : false ) );
  var orgs = ( ( e ) => ( ( e ) ? ( e.out( its.type ) === 'orgs' ) : false ) );

  // Document-wise tokens.
  var tokens = [
    [
      [ 'F-16', '/', 'F-15', 'not', 'manufactured', 'by', 'AT&T', '?' ],
      [ 'March', '21st', 'is', '1', 'by', 'five', ':p', '#fun', '!' ]
    ],
    [
      [ '@superman', ':', 'hit', 'me', 'up', 'on', 'my', 'email', 'r2d2@gmail.com', '.' ],
      [ 'we', 'will', 'plan', 'party', '🎉' ]
    ]
  ];

  // Token filter for words.
  const WORD = 'word';
  const PUNCTUATION = 'punctuation';
  var words = ( ( t ) => ( ( t ) ? ( t.out( its.type ) === WORD ) : false ) );
  var punctuations = ( ( t ) => ( ( t ) ? ( t.out( its.type ) === PUNCTUATION ) : false ) );
  // Doc 0 words.
  const d0words = [ 'F-16', 'F-15', 'not', 'manufactured', 'by', 'AT&T', 'March', 'is', 'by', 'five' ];
  // Doc 1 words
  const d1words = [ 'hit', 'me', 'up', 'on', 'my', 'email', 'we', 'will', 'plan', 'party' ];
  const d0TokenTypeTop2FT = [ [ 'word', 10 ], [ 'punctuation', 3 ] ];

  // Document level methods test cases.
  describe( 'Document Level Methods', function () {
    describe( '.out() method via reconstruction', function () {
      it( 't0 must must match with reconstructed docs[ 0 ]', function () {
        expect( docs[ 0 ].out() ).to.deep.equal( t0 );
      } ); // t0 must must match with reconstructed docs[ 0 ]

      it( 't1 must must match with reconstructed docs[ 1 ]', function () {
        expect( docs[ 1 ].out() ).to.deep.equal( t1 );
      } ); // t1 must must match with reconstructed docs[ 1 ]

      // Tests for span & negation flag.
      docs.forEach( ( d, k ) => {
        expect( d.out( its.span ) ).to.deep.equal( docSpans[ k ] );
        expect( d.out( its.negationFlag ) ).to.deep.equal( docNegFlag[ k ] );
      } );
    } ); // Document reconstruction


    it( '.sentences() method via s.index()', function () {
      for ( let i = 0; i < docs.length; i += 1 ) {
        docs[ i ].sentences().each( ( s, k ) => {
          expect( s.index() ).to.equal( k );
        } );
      } // for
    } );

    it( '.entities() method via e.index()', function () {
      for ( let i = 0; i < docs.length; i += 1 ) {
        docs[ i ].entities().each( ( e, k ) => {
          expect( e.index() ).to.equal( k );
        } );
      } // for
    } );

    it( '.customEntities() method via e.index()', function () {
      for ( let i = 0; i < docs.length; i += 1 ) {
        docs[ i ].customEntities().each( ( e, k ) => {
          expect( e.index() ).to.equal( k );
        } );
      } // for
    } );

    it( '.tokens() method via t.index()', function () {
      for ( let i = 0; i < docs.length; i += 1 ) {
        docs[ i ].tokens().each( ( t, k ) => {
          expect( t.index() ).to.equal( k );
        } );
      } // for
    } );

    it( '.isLexeme() method', function () {
      expect( !!docs[ 0 ].isLexeme( 'the' ) ).to.equal( true );
    } );

    it( '.isOOV() method', function () {
      expect( docs[ 0 ].isOOV( '@superman' ) ).to.equal( true );
    } );
  } ); // Document Level Methods
  /* ------------------------------------------------------------------------ */

  // Sentences & sentence level methods test cases.
  describe( 'Sentences Level Methods', function () {
    // Array of sentence items.
    const sItems = [];
    // Collection of Sentence Level Methods
    describe( 'Collection of Sentence Level Methods', function () {
      it( '.each() method via .itmAt()', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].sentences().each( ( s, k ) => {
            expect( s.out() ).to.deep.equal( docs[ i ].sentences().itemAt( k ).out() );
            // Double check:
            expect( s.out() ).to.deep.equal( sentences[ i ][ k ] );
            // Save sentence-item for later use.
            sItems.push( s );
          } );
        }
      } ); // .each() method via .itmAt()

      it( '.length() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].sentences().length() ).to.equal( sentences[ i ].length );
        } // for
      } ); // .length() method

      it( '.out() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].sentences().out() ).to.deep.equal( sentences[ i ] );
          expect( docs[ i ].sentences().out( its.span ) ).to.deep.equal( sentSpans[ i ] );
          expect( docs[ i ].sentences().out( its.negationFlag ) ).to.deep.equal( sentNegFlag[ i ] );
        } // for
      } ); // .out() method
    } ); // Collection of Sentence Level Methods

    describe( 'Single Sentence Level Methods', function () {
      it( '.parentDocument() method along with .out()', function () {
        sItems.forEach( ( s, k ) => {
          expect( s.parentDocument().sentences().itemAt( 0 ).out() ).to.deep.equal( sentences[ Math.floor( k / 2 ) ][ 0 ] );
        } );
      } );

      it( '.markup() method', function () {
        const mut = '<mark>F-16/F-15 not manufactured by AT&T?</mark> March 21st is 1 by five:p#fun!';
        const aDoc = nlp.readDoc( t0 );
        aDoc.sentences().itemAt( 0 ).markup();
        expect( aDoc.out( its.markedUpText ) ).to.deep.equal( mut );
        expect( docs[ 0 ].out( its.markedUpText ) ).to.deep.equal( t0 );
      } ); // .markup() method

      it( '.entities() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].sentences().each( ( s, k ) => {
            expect( s.entities().out() ).to.deep.equal( entities[ i ][ k ] );
          } );
        }
      } ); // .entities() method

      it( '.customEntities() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].sentences().each( ( s, k ) => {
            expect( s.customEntities().out() ).to.deep.equal( customEntities[ i ][ k ] );
          } );
        }
      } ); // .customEntities() method

      it( '.tokens() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].sentences().each( ( s, k ) => {
            expect( s.tokens().out() ).to.deep.equal( tokens[ i ][ k ] );
          } );
        }
      } ); // .tokens() method

      it( '.index() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].sentences().each( ( s, k ) => {
            expect( s.index() ).to.equal( k );
          } );
        } // for
      } );
    } ); // Single Sentence Level Methods

  } ); // Sentences Level Methods
  /* ------------------------------------------------------------------------ */

  // Entities & entity level methods test cases.
  describe( 'Entities Level Methods', function () {
    // Collection of Entities Level Methods
    describe( 'Collection of Entities Level Methods', function () {
      it( '.each() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].entities().each( ( e, k ) => {
            expect( ( e ) ? e.out() : undefined ).to.equal( [].concat( [], ...entities[ i ] )[ k ] );
          } );
        } // for
      } ); // .each() method

      it( '.filter() method', function () {
        expect( docs[ 0 ].entities().filter( dates ).out() ).to.deep.equal( d0[ DATE ] );
        expect( docs[ 0 ].entities().filter( cardinals ).out() ).to.deep.equal( d0[ CARDINAL ] );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          for ( let k = 0; k < docs[ i ].entities().length(); k += 1 ) {
            const eAtK = docs[ i ].entities().itemAt( k );
            const value = ( eAtK ) ? eAtK.out() : undefined;
            expect( value ).to.equal( [].concat( [], ...entities[ i ] )[ k ] );
          }
        } // for
      } ); // .itemAt() method

      it( '.length() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].entities().length() ).to.equal( [].concat( [], ...entities[ i ] ).length );
        } // for
      } ); // .length() method

      it( '.out() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].entities().out() ).to.deep.equal( [].concat( [], ...entities[ i ] ) );
        } // for

        // Test map-reduce also.
        expect( docs[ 0 ].entities().out( its.type, as.freqTable ).slice( 0, 2 ) ).to.deep.equal( d0.entityTypeFT );
        // And span as well.
        expect( docs[ 0 ].entities().out( its.span ) ).to.deep.equal( d0.entitySpans );
      } ); // .out() method
    } ); // Collection of Entities Level Methods

    // Selection of Entities level methods.
    describe( 'Selection of Entities Level Methods', function () {
      const selOfCardinals = docs[ 0 ].entities().filter( cardinals );

      it( '.each() method', function () {
        selOfCardinals.each( ( e, k ) => {
          expect( e.out() ).to.equal( d0[ CARDINAL ][ k ] );
        } );
      } ); // .each() method

      it( '.filter() method', function () {
        expect( selOfCardinals.filter( ( e ) => ( e.out() === d0[ CARDINAL ][ 0 ] ) ).out() ).to.deep.equal( d0[ CARDINAL ].slice( 0, 1 ) );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < selOfCardinals.length(); i += 1 ) {
          expect( selOfCardinals.itemAt( i ).out() ).to.equal( d0[ CARDINAL][ i ] );
        }
      } ); // .itemAt() method

      it( '.length() method', function () {
        expect( selOfCardinals.length() ).to.deep.equal( d0[ CARDINAL ].length );
      } ); // .length() method

      it( '.out() method', function () {
        expect( selOfCardinals.out() ).to.deep.equal( d0[ CARDINAL ] );
        expect( selOfCardinals.out( its.detail ) ).to.deep.equal( d0CardinalDetails );
      } ); // .out() method
    } ); // Selection of Entities level methods.

    // Single Entity level methods.
    describe( 'Single Entity Level Methods', function () {
      // Entity at 0.
      const eat0 = 0;
      // Single-entity extracted from `at0`.
      const se = docs[ 0 ].entities().itemAt( eat0 );
      // The actual entity as extracted via doc0 entities data.
      const d0se0 = [].concat( [], ...entities[ 0 ] )[ eat0 ];

      it( '.parentDocument() method', function () {
        expect( se.parentDocument().entities().itemAt( 0 ).out() ).to.equal( d0se0 );
      } ); // .length() method

      it( '.markup() method', function () {
        const mut = 'F-16/F-15 not manufactured by AT&T? <mark>March 21st</mark> is <mark>1</mark> by <mark>five</mark><mark>:p</mark><mark>#fun</mark>!';
        const aDoc = nlp.readDoc( t0 );
        aDoc.entities().each( ( e ) => ( e.markup() ) );
        expect( aDoc.out( its.markedUpText ) ).to.deep.equal( mut );
        expect( docs[ 0 ].out( its.markedUpText ) ).to.deep.equal( t0 );
      } ); // .markup() method

      it( '.out() method', function () {
        expect( se.out() ).to.equal( d0se0 );
      } ); // .out() method

      it( '.parentSentence() method', function () {
        expect( se.parentSentence().out() ).to.equal( docs[ 0 ].sentences().itemAt( 1 ).out() );
      } ); // .out() method

      it( '.tokens() method', function () {
        expect( se.tokens().out() ).to.deep.equal( d0se0.split( ' ' ) );
      } ); // .tokens() method

      it( '.index() method', function () {
        expect( se.index() ).to.deep.equal( eat0 );
      } ); // .index() method
    } ); // Single Entity Level methods
  } ); // Entities Level Methods
  /* ------------------------------------------------------------------------ */

  // Custom entities & entity level methods test cases.
  describe( 'Custom entities Level Methods', function () {
    // Collection of Entities Level Methods
    describe( 'Collection of Custom Entities Level Methods', function () {
      it( '.each() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].customEntities().each( ( e, k ) => {
            expect( ( e ) ? e.out() : undefined ).to.equal( [].concat( [], ...customEntities[ i ] )[ k ] );
          } );
        } // for
      } ); // .each() method

      it( '.filter() method', function () {
        expect( docs[ 0 ].customEntities().filter( fighters ).out() ).to.deep.equal( d0ce.fighters );
        expect( docs[ 0 ].customEntities().filter( orgs ).out() ).to.deep.equal( d0ce.orgs );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          for ( let k = 0; k < docs[ i ].customEntities().length(); k += 1 ) {
            const eAtK = docs[ i ].customEntities().itemAt( k );
            const value = ( eAtK ) ? eAtK.out() : undefined;
            expect( value ).to.equal( [].concat( [], ...customEntities[ i ] )[ k ] );
          }
        } // for
      } ); // .itemAt() method

      it( '.length() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].customEntities().length() ).to.equal( [].concat( [], ...customEntities[ i ] ).length );
        } // for
      } ); // .length() method

      it( '.out() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].customEntities().out() ).to.deep.equal( [].concat( [], ...customEntities[ i ] ) );
        } // for

        // Test map-reduce also.
        expect( docs[ 0 ].customEntities().out( its.type, as.freqTable ).slice( 0, 2 ) ).to.deep.equal( d0ce.entityTypeFT );
        // And span as well.
        expect( docs[ 0 ].customEntities().out( its.span ) ).to.deep.equal( d0ce.entitySpans );
      } ); // .out() method
    } ); // Collection of Custom Entities Level Methods

    // Selection of Custom Entities level methods.
    describe( 'Selection of Custom Entities Level Methods', function () {
      const selOfFighters = docs[ 0 ].customEntities().filter( fighters );

      it( '.each() method', function () {
        selOfFighters.each( ( e, k ) => {
          expect( e.out() ).to.equal( d0ce.fighters[ k ] );
        } );
      } ); // .each() method

      it( '.filter() method', function () {
        expect( selOfFighters.filter( ( e ) => ( e.out() === d0ce.fighters[ 0 ] ) ).out() ).to.deep.equal( d0ce.fighters.slice( 0, 1 ) );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < selOfFighters.length(); i += 1 ) {
          expect( selOfFighters.itemAt( i ).out() ).to.equal( d0ce.fighters[ i ] );
        }
      } ); // .itemAt() method

      it( '.length() method', function () {
        expect( selOfFighters.length() ).to.deep.equal( d0ce.fighters.length );
      } ); // .length() method

      it( '.out() method', function () {
        expect( selOfFighters.out() ).to.deep.equal( d0ce.fighters );
        expect( selOfFighters.out( its.detail ) ).to.deep.equal( d0ceFighetrsDetails );
      } ); // .out() method
    } ); // Selection of Custom Entities level methods.

    // Single Custom Entity level methods.
    describe( 'Single Custom Entity Level Methods', function () {
      // Entity at 0.
      const eat0 = 0;
      // Single-entity extracted from `at0`.
      const se = docs[ 0 ].customEntities().itemAt( eat0 );
      // The actual entity as extracted via doc0 entities data.
      const d0se0 = [].concat( [], ...customEntities[ 0 ] )[ eat0 ];

      it( '.parentDocument() method', function () {
        expect( se.parentDocument().customEntities().itemAt( 0 ).out() ).to.equal( d0se0 );
      } ); // .length() method

      it( '.markup() method', function () {
        const mut = '<mark>F-16</mark>/<mark>F-15</mark> not manufactured by <mark>AT&T</mark>? March 21st is 1 by five:p#fun!';
        const aDoc = nlp.readDoc( t0 );
        aDoc.customEntities().each( ( e ) => ( e.markup() ) );
        expect( aDoc.out( its.markedUpText ) ).to.deep.equal( mut );
        expect( docs[ 0 ].out( its.markedUpText ) ).to.deep.equal( t0 );
      } ); // .markup() method

      it( '.out() method', function () {
        expect( se.out() ).to.equal( d0se0 );
      } ); // .out() method

      it( '.parentSentence() method', function () {
        expect( se.parentSentence().out() ).to.equal( docs[ 0 ].sentences().itemAt( 0 ).out() );
      } ); // .out() method

      it( '.tokens() method', function () {
        expect( se.tokens().out() ).to.deep.equal( d0se0.split( ' ' ) );
      } ); // .tokens() method

      it( '.index() method', function () {
        expect( se.index() ).to.deep.equal( eat0 );
      } ); // .index() method
    } ); // Single Custom Entity Level methods
  } ); // Custom entities Level Methods
  /* ------------------------------------------------------------------------ */

  // Tokens & token level methods test cases.
  describe( 'Tokens Level Methods', function () {
    // Collections of Tokens Level Methods
    describe( 'Collections of Tokens Level Methods', function () {
      it( '.each() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].tokens().each( ( t, k ) => {
            expect( ( t ) ? t.out() : undefined ).to.equal( [].concat( [], ...tokens[ i ] )[ k ] );
          } );
        } // for
      } ); // .each() method

      it( '.filter() method', function () {
        expect( docs[ 0 ].tokens().filter( words ).out() ).to.deep.equal( d0words );
        expect( docs[ 1 ].tokens().filter( words ).out() ).to.deep.equal( d1words );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          for ( let k = 0; k < docs[ i ].tokens().length(); k += 1 ) {
            const tAtK = docs[ i ].tokens().itemAt( k );
            const value = ( tAtK ) ? tAtK.out() : undefined;
            expect( value ).to.equal( [].concat( [], ...tokens[ i ] )[ k ] );
          }
        } // for
      } ); // .itemAt() method

      it( '.length() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].tokens().length() ).to.equal( [].concat( [], ...tokens[ i ] ).length );
        } // for
      } ); // .length() method

      it( '.out() method', function () {
        for ( let i = 0; i < docs.length; i += 1 ) {
          expect( docs[ i ].tokens().out() ).to.deep.equal( [].concat( [], ...tokens[ i ] ) );
        } // for

        // Test map-reduce also.
        expect( docs[ 0 ].tokens().out( its.type, as.freqTable ).slice( 0, 2 ) ).to.deep.equal( d0TokenTypeTop2FT );
        // The span is unsupported, so it should fall bak to `its.value`!
        expect( docs[ 0 ].tokens().out( its.span ) ).to.deep.equal( [].concat( [], ...tokens[ 0 ] ) );
      } ); // .out() method
    } ); // Collections of Tokens Level Methods

    // Selection of Tokens Level Methods
    describe( 'Selection of Tokens Level Methods', function () {
      const selOfWords0 = docs[ 0 ].tokens().filter( words );
      const selOfWords1 = docs[ 1 ].tokens().filter( words );

      it( '.each() method', function () {
        selOfWords0.each( ( e, k ) => {
          expect( e.out() ).to.equal( d0words[ k ] );
        } );

        selOfWords1.each( ( e, k ) => {
          expect( e.out() ).to.equal( d1words[ k ] );
        } );
      } ); // .each() method

      it( '.filter() method', function () {
        expect( selOfWords0.filter( ( t ) => ( t.out().length < 3 ) ).out() ).to.deep.equal( [ 'by', 'is', 'by' ] );
        expect( selOfWords1.filter( ( t ) => ( t.out().length < 3 ) ).out() ).to.deep.equal( [ 'me', 'up', 'on', 'my', 'we' ] );
      } ); // .filter() method

      it( '.itemAt() method', function () {
        for ( let i = 0; i < selOfWords0.length(); i += 1 ) {
          expect( selOfWords0.itemAt( i ).out() ).to.equal( d0words[ i ] );
        }

        for ( let i = 0; i < selOfWords1.length(); i += 1 ) {
          expect( selOfWords1.itemAt( i ).out() ).to.equal( d1words[ i ] );
        }
      } ); // .itemAt() method

      it( '.length() method', function () {
        expect( selOfWords0.length() ).to.equal( d0words.length );
        expect( selOfWords1.length() ).to.equal( d1words.length );
      } ); // .length() method

      it( '.out() method', function () {
        expect( selOfWords0.out() ).to.deep.equal( d0words );
        expect( selOfWords1.out() ).to.deep.equal( d1words );
        expect( selOfWords1.out( its.value, as.text ) ).to.deep.equal( d1words.join( ' ' ) );
      } ); // .out() method
    } ); // Selection of Tokens Level Methods

    describe( 'Single Tokens Level Methods', function () {
      // Entity at 0.
      const tat0 = 0;
      // Single-entity extracted from `at0`.
      const te = docs[ 0 ].tokens().itemAt( tat0 );
      // The actual entity as extracted via doc0 entities data.
      const d0te0 = [].concat( [], ...tokens[ 0 ] )[ tat0 ];

      it( '.parentDocument() method', function () {
        expect( te.parentDocument().tokens().itemAt( 0 ).out() ).to.equal( d0te0 );
      } ); // .length() method

      it( '.parentEntity() method', function () {
        const tat9 = 9;
        const te9 = docs[ 0 ].tokens().itemAt( tat9 );
        const undef = docs[ 0 ].tokens().itemAt( tat9 + 1 );

        expect( te9.parentEntity().out() ).to.deep.equal( d0[ DATE ][ 0 ] );
        expect( undef.parentEntity() ).to.deep.equal( undefined );
      } ); // .length() method

      it( '.markup() method', function () {
        const mut = 'F-16<mark>/</mark>F-15 not manufactured by AT&T<mark>?</mark> March 21st is 1 by five:p#fun<mark>!</mark>';
        const aDoc = nlp.readDoc( t0 );
        aDoc.tokens().filter( punctuations ).each( ( t ) => ( t.markup() ) );
        expect( aDoc.out( its.markedUpText ) ).to.deep.equal( mut );
        expect( docs[ 0 ].out( its.markedUpText ) ).to.deep.equal( t0 );
      } ); // .markup() method

      it( '.out() method', function () {
        expect( te.out() ).to.equal( d0te0 );
      } ); // .out() method

      it( '.parentSentence() method', function () {
        const parentSents = [
          [
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1, 1, 1, 1, 1
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 1, 1, 1, 1
          ]
        ];

        for ( let i = 0; i < docs.length; i += 1 ) {
          docs[ i ].tokens().each( ( t, k ) => {
            expect( t.parentSentence().out() ).to.deep.equal( sentences[ i ][ parentSents[ i ][ k ] ] );
          } );
        }
      } ); // .parentSentence() method

      it( '.index() method', function () {
        expect( te.index() ).to.equal( tat0 );
      } ); // .index() method

    } ); // Single Tokens Level Methods
  } ); // Tokens Level Methods
  /* ------------------------------------------------------------------------ */
} );
