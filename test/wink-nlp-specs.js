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
var model = require( './test-model/model.js' );
var its = require( '../src/its.js' );
var findEmptyTokens = require( './utilities/find-empty-tokens.js' );
var findOutOfSeqTokens = require( './utilities/find-out-of-seq-tokens.js' );
var findPotentialAbbrevs = require( './utilities/find-potential-abbrevs.js' );
// const lslSentence = require( './utilities/lsl.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

var nlp = winkNLP( model );

describe( 'wink-nlp test-coverage and basic behavior', function () {
  // Tokens to throttle maximum part of the code.
  var sentence = [
    // Emoji with complex combo of abbreviation with `-` and emoticon.
    '🎭Mr.-:) 🎉🎉 ',
    // Newline and email.
    '\n pappu@gmail.com  ',
    // Shourtforms within brackets and with apostrophe.
    '(I.I.T.) I.I.T\'s  ',
    // Period at the end of in-vocab word stuffed between 2 symbols
    '*good.* ',
    // URL.
    'https://winkjs.org ',
    // #hashtag
    '#great ',
    // Normal English words.
    'I met her in ',
    // Complex punctuations and decade.
    '(* - \'80s- *) \'and/or) ',
    '-\'cause\' ',
    'Pappu pass ho gaya — HaHaHa. ',
    // OOV, but normal in vocab and mapped to another spelling.
    'Recognise ',
    // OOVs plus mapped spelling.
    'it Pappu (pappu recognise)? ',
    // Contraction.
    'I can\'t do! i\'ll\'ve to do! ',
    // OOV with RP, whose normal is in vocab.
    'Strange! ',
    // Initials. & sir name.
    'I. K. Gujral ',
    // Single alpha with RP but RP not a period.
    ' who am I? ',
    // In vocab non alpha ending with RP (rgxAnyWithLP).
    '🎭, ',
    // Similarly with LP but with OOV (rgxAnyWithLP).
    '[🧞 [Dabbu ',
    // (in vocab).
    '(left) ',
    // (OOV).
    '(OOV) ',
    // A sample date
    'March 12, 1998 ',
    // Prefix rule
    'e-mail ',
    // Suffix rule
    'server-less ',
    // Number rule
    'F-16 ',
    // Split rule
    'zxcvbn-asfgh ',
    // More tricky cases for `tokenType` `word` handling
    'S.K.Saxena.Server-less computing is awesome. ',
    'Mr.S.K. Saxena ',
    // aaa.-bbb causes `[ 'aaa', '.', '', '-', 'bbb' ]`
    'aaa.-bbb ',
    // To text buggy regex for numerals
    '138375720109463900845220131105025504431resources094639008452'
  ].join( '' );

  var moreThanMaxSpaces = [
    'hello',
    ''.padEnd( 0x10003 ),
    'world'
  ].join( '' );

  var maxSpaces = [
    'hello',
    ''.padEnd( 0xFFFF ),
    'world'
  ].join( '' );

  it( 'should tokenize/detokenize the following sentence\n\n' + JSON.stringify( sentence ) + '\n', function () {
    var doc = nlp.readDoc( sentence  );
    // Reconstruction.
    expect( doc.out() ).to.equal( sentence );
  } );

  it( 'should not contain empty tokens', function () {
    var doc = nlp.readDoc( sentence  );
    expect( findEmptyTokens( doc ) ).deep.equal( [] );
  } );

  it( 'index and actual sequence should match', function () {
    var doc = nlp.readDoc( sentence  );
    expect( findOutOfSeqTokens( doc ) ).deep.equal( [] );
  } );

  it( 'tokens should not contain a potential abbrev with a seprated period', function () {
    var doc = nlp.readDoc( sentence  );
    expect( findPotentialAbbrevs( doc, its ) ).deep.equal( [] );
  } );

  it( 'should clip >max spaces to max spaces', function () {
    var doc = nlp.readDoc( moreThanMaxSpaces  );
    expect( doc.out() ).to.equal( maxSpaces );
  } );

  it( 'should display the correct tokens & their properties', function () {
    var doc = nlp.readDoc( sentence  );
    // Visual display.
    doc.printTokens();
  } );

  it( 'should throw error if readDoc is given non-text', function () {
    expect( nlp.readDoc.bind( 1 ) ).to.throw( /^wink-nlp: expecting a valid Javascript string/ );
  } );

  it( 'pipeConfig should return sbd, negation, sa, pos, ner and cer as true', function () {
    expect( nlp.readDoc('Test').pipeConfig() ).to.deep.equal( { sbd: true, negation: true, pos: true, sentiment: true, ner: true, cer: true } );
  } );
} );

describe( 'OOV handling', function () {
  var d1 = nlp.readDoc( 'Paul' );

  it( 'isLexeme() should return null on an OOV – "John"', function () {
    expect( d1.isLexeme( 'John' ) ).to.equal( null );
  } );

  it( 'isLexeme() should return non-null on a valid index for lower-cased of "Paul"', function () {
    expect( d1.isLexeme( 'paul' ) ).to.not.equal( null );
  } );

  it( 'isOOV() should return true for "Paul" & its lower case', function () {
    expect( d1.isOOV( 'paul' ) ).to.equal( true );
    expect( d1.isOOV( 'Paul' ) ).to.equal( true );
  } );

  it( 'isOOV() should return true for "John"', function () {
    expect( d1.isOOV( 'John' ) ).to.equal( true );
  } );

  it( 'isOOV() should return false for in vocab word & contraction', function () {
    expect( d1.isOOV( 'can\'t' ) ).to.equal( false );
    expect( d1.isOOV( 'she' ) ).to.equal( false );
  } );

  it( 'extracted features of "Paul" should be correct', function () {
    const suffix = d1.tokens().itemAt( 0 ).out( its.suffix );
    const prefix = d1.tokens().itemAt( 0 ).out( its.prefix );
    const normal = d1.tokens().itemAt( 0 ).out( its.normal );
    const shape = d1.tokens().itemAt( 0 ).out( its.shape );
    const case1 = d1.tokens().itemAt( 0 ).out( its.case );
    const tokenType = d1.tokens().itemAt( 0 ).out( its.type );

    expect( suffix ).to.equal( 'aul' );
    expect( prefix ).to.equal( 'Pa' );
    expect( normal ).to.equal( 'paul' );
    expect( shape ).to.equal( 'Xxxx' );
    expect( case1 ).to.equal( 'titleCase' );
    expect( tokenType ).to.equal( 'word' );
  } );

  it( 'isLexeme() and hash of "Paul" obtained via API should match', function () {
    const hashViaIsLexeme = d1.isLexeme( 'Paul' )[ 0 ];
    const hashViaAPI = d1.tokens().itemAt( 0 ).out( its.uniqueId );
    expect( hashViaAPI ).to.equal( hashViaIsLexeme );
  } );
} );

describe( 'Language model validity checks', function () {
  it( 'should throw error when no model is passed', function () {
    expect( winkNLP.bind( null ) ).to.throw( /^wink-nlp: invalid model used./ );
  } );

  it( 'should throw error when wrong model is passed', function () {
    expect( winkNLP.bind( null, { core: 3 } ) ).to.throw( /^wink-nlp: invalid model used./ );
  } );
} );

describe( 'Annotation pipe validity checks', function () {
  it( 'should throw error when incorrect pipe datatype is passed', function () {
    expect( winkNLP.bind( null, model, 3 ) ).to.throw( /^wink-nlp: invalid pipe, it must be an array instead found a "number"./ );
  } );

  it( 'should throw error when incorrect annotation type is passed', function () {
    expect( winkNLP.bind( null, model, [ 'wrong' ] ) ).to.throw( /^wink-nlp: invalid pipe annotation "wrong" found./ );
  } );
} );

describe( 'Empty Annotation pipe should not detect any of the existing annotations', function () {
  const nlpNoAnno = winkNLP( model, [] );

  it( 'should still learn from patterns', function () {
    const patterns = [
      { name: 'adjectiveNounPair', patterns: [ 'ADJ' ] }
    ];
    expect( nlpNoAnno.learnCustomEntities( patterns ) ).to.equal( 1 );
  } );

  const doc = nlpNoAnno.readDoc( 'Hello World! Not happy! :-)' );

  it( 'pipeConfig should return empty config', function () {
    expect( doc.pipeConfig() ).to.deep.equal( Object.create( null ) );
  } );

  it( 'should return single sentence', function () {
    expect( doc.sentences().length() ).to.equal( 1 );
    expect( doc.sentences().out()[ 0 ] ).to.equal( doc.out() );
  } );

  it( 'should not return any negated token', function () {
    // "happy" would be negated otherwise!
    expect( doc.tokens().itemAt( 4 ).out( its.negationFlag ) ).to.equal( false );
  } );

  it( 'should return overall sentiment as "0"', function () {
    expect( doc.out( its.sentiment ) ).to.equal( 0 );
  } );

  it( 'should return all pos as "UNK"', function () {
    expect( doc.tokens().out( its.pos ) ).to.deep.equal( [ 'UNK', 'UNK', 'UNK', 'UNK', 'UNK', 'UNK', 'UNK' ] );
  } );

  it( 'should return empty entity array', function () {
    expect( doc.entities().out() ).to.deep.equal( [] );
    expect( doc.entities().length() ).to.deep.equal( 0 );
  } );

  it( 'should return empty custom entity array', function () {
    expect( doc.entities().out() ).to.deep.equal( [] );
    expect( doc.entities().length() ).to.deep.equal( 0 );
  } );
} );

// describe( 'Limits handling', function () {
//   it( 'should throw error', function () {
//     expect( nlp.readDoc.bind( null, lslSentence ) ).to.throw( /^wink-nlp: memory/ );
//   } );
// } );

describe( 'Learn Custom Entities', function () {
  // var examples = [
  //   { name: 'pet-type', patterns: [ '[ADJ|thin] [cat|dog]' ], mark: [ 0, 0 ] },
  //   { name: 'crust-type', patterns: [ 'thin', 'regular', 'thick' ] },
  //   { name: 'escaped-adj-parrot', patterns: [ '^ADJ Parrot' ] },
  //   { name: 'escaped-money', patterns: [ '^MONEY' ] },
  //   { name: 'entity-money', patterns: [ 'MONEY' ] },
  //   { name: 'pos-type-money', patterns: [ 'SYM NUM' ] },
  //   { name: 'caret', patterns: [ '^^' ] },
  //   { name: 'caret-carrot', patterns: [ '^^carrot' ] },
  //   { name: 'email-emoticon', patterns: [ 'EMAIL EMOTICON' ] },
  // ];
  // var sentence = 'one@two.com:-) A ^green cat ate thin crust pizza with a thin dog! ADJ Parrot? $5 #MoNEY. ^ carrot!';
  it( 'should throw error if examples are undefined', function () {
    expect( nlp.learnCustomEntities.bind( null, undefined ) ).to.throw( 'wink-nlp: examples should be an array, instead found "undefined".' );
  } );

  it( 'should throw error if examples contain non-object elements', function () {
    expect( nlp.learnCustomEntities.bind( null, [ 1, 2 ] ) ).to.throw( /wink-nlp: each example should be an object, instead found a "number"/ );
  } );

  it( 'should throw error if an example has missing name', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { patterns: [] } ] ) ).to.throw( /wink-nlp: name should be a string, instead found "undefined"/ );
  } );

  it( 'should throw error if an example has blank name', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: '', patterns: [] } ] ) ).to.throw( /wink-nlp: name should be a string, instead found ""/ );
  } );

  it( 'should throw error if an example undefined patterns', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: 'ok' } ] ) ).to.throw( /wink-nlp: patterns should be an array, instead found "undefined"/ );
  } );

  it( 'should throw error if an example\'s patterns does not contain string', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: 'ok', patterns: [ 1 ] } ] ) ).to.throw( /wink-nlp: each pattern should be a string, instead found "1"/ );
  } );

  it( 'should throw error if an example\'s patterns contains blank string', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: 'ok', patterns: [ '' ] } ] ) ).to.throw( /wink-nlp: each pattern should be a string, instead found ""/ );
  } );

  it( 'should throw error if config is not an object', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: 'ok', patterns: [ 'a b' ] } ], 1 ) ).to.throw( /wink-nlp: config should be an object, instead found "number"/ );
  } );

  it( 'should throw error if example is incorrect', function () {
    expect( nlp.learnCustomEntities.bind( null, [ { name: 'ok', patterns: [ '[a#]' ] } ] ) ).to.throw( 'wink-nlp: incorrect token "a#" encountered in examples of learnCustomEntities() API.' );
  } );

  it( 'correct examples should return the count of examples learned', function () {
    expect( nlp.learnCustomEntities( [ { name: 'ok', patterns: [ 'a b' ] } ] ) ).to.equal( 1 );
  } );

  it( 'with correct examples/default connfig, entity detection should happen', function () {
    expect( nlp.learnCustomEntities( [ { name: 'adj-noun-pair', patterns: [ 'ADJ NOUN' ] }, { name: 'entity-money', patterns: [ 'MONEY' ] } ] ) ).to.equal( 2 );
    const d = nlp.readDoc( 'A green cat snatched $5 from me!');
    expect( d.customEntities().out() ).to.deep.equal( [ 'green cat', '$5' ] );
  } );

} );

describe( 'Throttle pops membership in cache', function () {
  it( 'should throttle', function () {
    expect( nlp.readDoc( 'would like to show!' ).tokens().out( its.pos ) ).to.deep.equal( [ 'AUX', 'VERB', 'PART', 'VERB', 'PUNCT' ] );
  } );
} );
