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
// var as = require( '../src/as.js' );
var model = require( './test-model/model.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'APIs — A', function () {
  var nlp = winkNLP( model );

  const text1 = '@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise. My e-mail:r2d2@gmail.com, 2.0, of us plan. party🎉🎉, tom at \'3pm:)#fun, 111';
  const text2 = '@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise. My e-mail:r2d2@gmail.com, 2.0, of us plan. party🎉🎉, tom at \'3pm:)#fun, 222';

  // Tokens of doc 1 & 2.
  const tokens1 = [ '@superman', ':', 'हिंदी', ',', 'ca', 'n\'t', '3rd', 'Hit', 'me', '1st', '1st', 'ME', 'Recognise', '.', 'My', 'e-mail', ':', 'r2d2@gmail.com', ',', '2.0', ',', 'of', 'us', 'plan', '.', 'party', '🎉', '🎉', ',', 'tom', 'at', '\'', '3pm', ':)', '#fun', ',', '111' ];
  const tokens2 = [ '@superman', ':', 'हिंदी', ',', 'ca', 'n\'t', '3rd', 'Hit', 'me', '1st', '1st', 'ME', 'Recognise', '.', 'My', 'e-mail', ':', 'r2d2@gmail.com', ',', '2.0', ',', 'of', 'us', 'plan', '.', 'party', '🎉', '🎉', ',', 'tom', 'at', '\'', '3pm', ':)', '#fun', ',', '222' ];

  // Filtered numbers of doc 1 & 2.
  const f1num = [ '2.0', '111' ];
  const f2num = [ '2.0', '222' ];
  const f1numtt = [ 'number', 'number' ];
  const f2numtt = [ 'number', 'number' ];

  // Marked up texts.
  const markedupSentencet1 = '<mark>@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise.</mark> My e-mail:r2d2@gmail.com, 2.0, of us plan. party🎉🎉, tom at \'3pm:)#fun, 111';
  const markedupSentencet1num = '<mark>@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise.</mark> My e-mail:r2d2@gmail.com, <mark>2.0</mark>, of us plan. party🎉🎉, tom at \'3pm:)#fun, <mark>111</mark>';
  const mt2 = '@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise. My e-mail:r2d2@gmail.com, <mark class="number">2.0</mark>, of us plan. party🎉🎉, tom at \'3pm:)#fun, <mark class="number">222</mark>';

  const markedupEntitiesOfT1 = '<mark>@superman</mark>:हिंदी,  can\'t <mark>3rd</mark> Hit me <mark>1st</mark> <mark>1st</mark> ME   Recognise. My e-mail:<mark>r2d2@gmail.com</mark>, <mark>2.0</mark>, of us plan. party<mark>🎉</mark><mark>🎉</mark>, tom at \'<mark>3pm</mark><mark>:)</mark><mark>#fun</mark>, <mark>111</mark>';

  // Sentences of doc 1 & 2.
  const as1 = [ '@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise.',
                'My e-mail:r2d2@gmail.com, 2.0, of us plan.',
                'party🎉🎉, tom at \'3pm:)#fun, 111' ];

  const as2 = [ '@superman:हिंदी,  can\'t 3rd Hit me 1st 1st ME   Recognise.',
                'My e-mail:r2d2@gmail.com, 2.0, of us plan.',
                'party🎉🎉, tom at \'3pm:)#fun, 222' ];

  const ae1 = [
    { value: '@superman', type: 'MENTION' }, { value: '3rd', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' },
    { value: 'r2d2@gmail.com', type: 'EMAIL' }, { value: '2.0', type: 'CARDINAL' },
    { value: '🎉', type: 'EMOJI' }, { value: '🎉', type: 'EMOJI' }, { value: '3pm', type: 'TIME' }, { value: ':)', type: 'EMOTICON' }, { value: '#fun', type: 'HASHTAG' }, { value: '111', type: 'CARDINAL' }
  ];
  const ae2 = [
    { value: '@superman', type: 'MENTION' }, { value: '3rd', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' },
    { value: 'r2d2@gmail.com', type: 'EMAIL' }, { value: '2.0', type: 'CARDINAL' },
    { value: '🎉', type: 'EMOJI' }, { value: '🎉', type: 'EMOJI' }, { value: '3pm', type: 'TIME' }, { value: ':)', type: 'EMOTICON' }, { value: '#fun', type: 'HASHTAG' }, { value: '222', type: 'CARDINAL' }
  ];

  // Sentences that are different. Doc-N-Sentence-N-Tokens.
  const d1s2t = [ 'party', '🎉', '🎉', ',', 'tom', 'at', '\'', '3pm', ':)', '#fun', ',', '111' ];
  const d2s2t = [ 'party', '🎉', '🎉', ',', 'tom', 'at', '\'', '3pm', ':)', '#fun', ',', '222' ];

  // Sentence wise entities of doc 1 & 2.
  const d1SentenceWiseEntities = [
    [ { value: '@superman', type: 'MENTION' }, { value: '3rd', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' } ],
    [ { value: 'r2d2@gmail.com', type: 'EMAIL' }, { value: '2.0', type: 'CARDINAL' } ],
    [ { value: '🎉', type: 'EMOJI' }, { value: '🎉', type: 'EMOJI' }, { value: '3pm', type: 'TIME' }, { value: ':)', type: 'EMOTICON' }, { value: '#fun', type: 'HASHTAG' }, { value: '111', type: 'CARDINAL' } ]
  ];

  const d2SentenceWiseEntities = [
    [ { value: '@superman', type: 'MENTION' }, { value: '3rd', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' }, { value: '1st', type: 'ORDINAL' } ],
    [ { value: 'r2d2@gmail.com', type: 'EMAIL' }, { value: '2.0', type: 'CARDINAL' } ],
    [ { value: '🎉', type: 'EMOJI' }, { value: '🎉', type: 'EMOJI' }, { value: '3pm', type: 'TIME' }, { value: ':)', type: 'EMOTICON' }, { value: '#fun', type: 'HASHTAG' }, { value: '222', type: 'CARDINAL' } ]
  ];

  // Create doc using nlp.
  var doc1 = nlp.readDoc( text1 );
  var doc2 = nlp.readDoc( text2 );
  var doc4entMarkup = nlp.readDoc( text1 );

  describe( 'doc API', function () {
    it( '.isLexeme() should detect lexemes correctly', function () {
      expect( doc1.isLexeme( 'recognise' ) ).to.deep.equal( [ 61294 ] );

      expect( doc2.isLexeme( 'zxcvbnm' ) ).to.deep.equal( null );
    } );

    it( '.out() should return the original text', function () {
      expect( doc1.out() ).to.deep.equal( text1 );

      expect( doc2.out() ).to.deep.equal( text2 );
    } );

    // ItemAt boundary tests.
    // Will need a revamp once SBD is in place (TODO):
    describe( 'doc API out of range access test', function () {
      it( '.sentences() should return undefined for out of range index', function () {
        expect( doc1.sentences().itemAt( -1 ) ).to.equal( undefined );
        expect( doc1.sentences().itemAt( doc1.sentences().length() ) ).to.equal( undefined );
      } );

      it( '.tokens().itemAt() should return undefined for out of range index', function () {
        expect( doc1.tokens().itemAt( -1 ) ).to.equal( undefined );
        expect( doc1.tokens().itemAt( doc1.tokens().length() ) ).to.equal( undefined );
      } );

      it( '.tokens().filter().itemAt() should return undefined for out of range index', function () {
        const ftk1 = doc1.tokens().filter( ( t ) => ( t.out( its.type ) === 'word' ) );
        expect( ftk1.itemAt( -1 ) ).to.equal( undefined );
        expect( ftk1.itemAt( ftk1.length() ) ).to.equal( undefined );
      } );
    } );

    describe( 'doc.sentences() API', function () {
      it( '.out() should return array of sentences', function () {
        expect( doc1.sentences().out() ).to.deep.equal( as1 );

        expect( doc2.sentences().out() ).to.deep.equal( as2 );
      } );

      it( '.length() should return number of sentences', function () {
        const l1 = doc1.sentences().length();
        expect( l1 ).to.equal( 3 );

        const l2 = doc2.sentences().length();
        expect( l2 ).to.equal( 3 );
      } );

      it( '.each() iterator should go through each sentence', function () {
        var parentDoc1;
        doc1.sentences().each( ( s, k ) => {
          expect( s.out() ).to.deep.equal( as1[ k ] );
          if ( k === 0 ) s.markup();
          parentDoc1 = s.parentDocument();
        } );

        expect( parentDoc1.out( its.markedUpText ) ).to.equal( markedupSentencet1 );

        doc2.sentences().each( ( s, k ) => {
          expect( s.out() ).to.deep.equal( as2[ k ] );
        } );
      } );

      it( '.itemAt() should return correct sentence item', function () {
        const i11 = doc1.sentences().itemAt( 0 );
        expect( i11.out() ).to.equal( as1[ 0 ] );

        const i22 = doc2.sentences().itemAt( 2 );
        expect( i22.out() ).to.equal( as2[ 2 ] );
      } );

      it( '.tokens().each() should return retlative token indexes — k', function () {
        doc1.sentences().itemAt( 2 ).tokens().each( ( t, k ) => {
          expect( t.out() ).to.equal( d1s2t[ k ] );
        } );

        doc2.sentences().itemAt( 2 ).tokens().each( ( t, k ) => {
          expect( t.out() ).to.equal( d2s2t[ k ] );
        } );
      } );

      it( 'sentence.entities() should sentence wise entities correctly', function () {
        doc1.sentences().each( ( s, k ) => {
          expect( s.entities().out( its.detail ) ).deep.equal( d1SentenceWiseEntities[ k ] );
        } );

        doc2.sentences().each( ( s, k ) => {
          expect( s.entities().out( its.detail ) ).deep.equal( d2SentenceWiseEntities[ k ] );
        } );
      } );
    } ); // doc.sentences() API

    describe( 'doc.entities() API', function () {
      it( '.out() should return array of sentences', function () {
        expect( doc1.entities().out( its.detail ) ).to.deep.equal( ae1 );

        expect( doc2.entities().out( its.detail ) ).to.deep.equal( ae2 );
      } );

      it( '.length() should return number of sentences', function () {
        const l1 = doc1.entities().length();
        expect( l1 ).to.equal( 12 );

        const l2 = doc2.entities().length();
        expect( l2 ).to.equal( 12 );
      } );

      it( '.each() iterator should go through each entity', function () {
        doc1.entities().each( ( e, k ) => {
          expect( e.out( its.detail ) ).to.deep.equal( ae1[ k ] );
        } );

        doc2.entities().each( ( e, k ) => {
          expect( e.out( its.detail ) ).to.deep.equal( ae2[ k ] );
        } );
      } );

      it( '.itemAt() should return correct entity item', function () {
        const i11 = doc1.entities().itemAt( 5 );
        expect( i11.out( its.detail ) ).to.deep.equal( ae1[ 5 ] );

        const i22 = doc2.entities().itemAt( 5 );
        expect( i22.out( its.detail ) ).to.deep.equal( ae2[ 5 ] );

        expect( doc2.entities().itemAt( 12 ) ).to.deep.equal( undefined );
      } );

      it( '.filter() should return correctly filter entities', function () {
        const fe1 = doc1.entities().filter( ( e ) => ( e.out( its.type ) === 'CARDINAL' ) );
        const fae1 = ae1.filter( ( e ) => ( e.type === 'CARDINAL' ) );
        // .length()
        expect( fe1.length() ).to.equal( 2 );
        // Filtered entities === array.
        expect( fe1.out( its.detail ) ).to.deep.equal( fae1 );
        // Within range item test.
        expect( fe1.itemAt( 1 ).out( its.detail ) ).to.deep.equal( fae1[ 1 ] );
        // Also check the parent document!
        expect( fe1.itemAt( 1 ).parentDocument() ).to.deep.equal( doc1 );
        // Out of range item test
        expect( fe1.itemAt( 2 ) ).to.deep.equal( undefined );
        // itemAt() api.
        fe1.each( ( e, k ) => {
          expect( e.out() ).to.deep.equal( fe1.itemAt( k ).out() );
        } );

        // Repeat for doc2.
        const fe2 = doc2.entities().filter( ( e ) => ( e.out( its.type ) === 'CARDINAL' ) );
        const fae2 = ae2.filter( ( e ) => ( e.type === 'CARDINAL' ) );
        expect( fe2.length() ).to.equal( 2 );
        expect( fe2.out( its.detail ) ).to.deep.equal( fae2 );
        expect( fe2.itemAt( 1 ).out( its.detail ) ).to.deep.equal( fae2[ 1 ] );
        expect( fe2.itemAt( 1 ).parentDocument() ).to.deep.equal( doc2 );
        expect( fe2.itemAt( 3 ) ).to.deep.equal( undefined );
        fe2.each( ( e, k ) => {
          expect( e.out() ).to.deep.equal( fe2.itemAt( k ).out() );
        } );
      } );

      it( 'entities().each() --- markup() should mark all entitities correctly', function () {
        // Use the separate doc as doc1/2 have been already used for markup.
        doc4entMarkup.entities().each( ( e ) => ( e.markup() ) );
        expect( doc4entMarkup.out( its.markedUpText ) ).to.deep.equal( markedupEntitiesOfT1 );
      } );

      it( 'entities().each() --- sentence() should point correct sentence for each entitity', function () {
        // Maps entity's index to sentence's index.
        const es = [ 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2 ];
        doc1.entities().each( ( e, k ) => {
          expect( e.parentSentence().out() ).to.deep.equal( doc1.sentences().itemAt( es[ k ] ).out() );
        });

        doc2.entities().each( ( e, k ) => {
          expect( e.parentSentence().out() ).to.deep.equal( doc2.sentences().itemAt( es[ k ] ).out() );
        });
      } );
    } ); // doc.entities() API

    describe( 'doc.tokens() API', function () {
      it( '.out() should return the tokens', function () {
        // No function specified in out.
        expect( doc1.tokens().out() ).to.deep.equal( tokens1 );
        // `its.value` is specified in out.
        expect( doc2.tokens().out( its.value ) ).to.deep.equal( tokens2 );
      } );

      it( '.each() iterator should go through each token & its .markup(), .parentDocument() APIs', function () {
        // Parent documented extracted from tokens.
        var parentDoc1, parentDoc2;
        doc1.tokens().each( ( t, k ) => {
          // Test token correctness.
          expect( t.out() ).to.deep.equal( tokens1[ k ] );
          // Prepare for markup test.
          if ( t.out( its.type ) === 'number' ) t.markup();
          parentDoc1 = t.parentDocument();
        } );

        doc2.tokens().each( ( t, k ) => {
          // Test token correctness.
          expect( t.out() ).to.deep.equal( tokens2[ k ] );
          // Prepare for markup test.
          if ( t.out( its.type ) === 'number' ) t.markup( '<mark class="number">', '</mark>' );
          parentDoc2 = t.parentDocument();
        } );

        // Test parent document extractionalong with markup text!
        expect( parentDoc1.out( its.markedUpText ) ).to.equal( markedupSentencet1num );
        expect( parentDoc2.out( its.markedUpText ) ).to.equal( mt2 );
      } );

      describe( 'doc.tokens().filter() API', function () {
        it( '.reduce() to filter numbers should happen correctly', function () {
          const f1 = doc1.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out();
          expect( f1 ).to.deep.equal( f1num );

          const f2 = doc2.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out();
          expect( f2 ).to.deep.equal( f2num );
        } );

        it( '.out() from filter numbers should happen correctly', function () {
          const f1 = doc1.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out();
          expect( f1 ).to.deep.equal( f1num );

          const f1tt = doc1.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out( its.type );
          expect( f1tt ).to.deep.equal( f1numtt );

          const f2 = doc2.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out();
          expect( f2 ).to.deep.equal( f2num );

          const f2tt = doc2.tokens()
                         .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
                         .out( its.type );
          expect( f2tt ).to.deep.equal( f2numtt );
        } );

        it( '.each() should iterate on filter numbers correctly', function () {
          doc1.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
              .each( ( t, k ) => {
                expect( t.out() ).to.equal( f1num[ k ] );
              } );


          doc2.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
              .each( ( t, k ) => {
                expect( t.out() ).to.equal( f2num[ k ] );
              } );
        } );

        it( '.itemAt() should return correct item from filtered numebrs', function () {
          const i1 = doc1.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
              .itemAt( 1 );
          expect( i1.out() ).to.equal( f1num[ 1 ] );

          const i2 = doc2.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'number' ) )
              .itemAt( 1 );
          expect( i2.out() ).to.equal( f2num[ 1 ] );
        } );

        it( '.length() should return number of items in filtered words/emojis', function () {
          const l1 = doc1.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'word' ) )
              .length();
          expect( l1 ).to.equal( 14 );

          const l2 = doc2.tokens()
              .filter( ( t ) => ( t.out( its.type ) === 'emoji' ) )
              .length();
          expect( l2 ).to.equal( 2 );
        } );
      } ); // doc.tokens().filter() API


      it( '.itemAt() should return correct item from tokens', function () {
        const i11 = doc1.tokens().itemAt( 0 );
        expect( i11.out() ).to.equal( tokens1[ 0 ] );

        const i12 = doc1.tokens().itemAt( 9 );
        expect( i12.out() ).to.equal( tokens1[ 9 ] );

        const i21 = doc2.tokens().itemAt( 18 );
        expect( i21.out() ).to.equal( tokens2[ 18 ] );

        const i22 = doc2.tokens().itemAt( 36 );
        expect( i22.out() ).to.equal( tokens2[ 36 ] );
      } );

      // Will need correction post SBD (TODO):
      it( '.itemAt() .parentSentence() should return correct sengtence', function () {
        const i11 = doc1.tokens().itemAt( 36 );
        expect( i11.parentSentence().out() ).to.equal( as1[ 2 ] );

        const i22 = doc2.tokens().itemAt( 36 );
        expect( i22.parentSentence().out() ).to.equal( as2[ 2 ] );
      } );

      it( '.length() should return correct number of items in tokens', function () {
        expect( doc1.tokens().length() ).to.equal( tokens1.length );

        expect( doc2.tokens().length() ).to.equal( tokens2.length );
      } );

      it( '.parentEntity() should function correctly', function () {
        const lastEntity1 = doc1.entities().length() - 1; // `111`
        const lastToken1 = doc1.tokens().length() - 1;
        expect( doc1.tokens().itemAt( lastToken1 ).parentEntity().out() ).to.deep.equal( doc1.entities().itemAt( lastEntity1 ).out() );
        expect( doc1.tokens().itemAt( 1 ).parentEntity() ).to.equal( undefined ); // `:`

        const lastEntity2 = doc2.entities().length() - 1; // `222`
        const lastToken2 = doc2.tokens().length() - 1;
        expect( doc2.tokens().itemAt( lastToken2 ).parentEntity().out() ).to.deep.equal( doc2.entities().itemAt( lastEntity2 ).out() );
        expect( doc2.tokens().itemAt( 1 ).parentEntity() ).to.equal( undefined ); // `:`
      } );
    } ); // doc.tokens() API

    // Needs a code review & test plan (TODO);
    it( '.printTokens() is a function', function () {
      expect( typeof doc1.printTokens ).to.deep.equal( 'function' );

    } );

  } ); // doc API

} );
