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

describe( 'its functions for .out()', function () {
  var nlp = winkNLP( model );

  it( 'its.case', function () {
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'lowerCase' );
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'titleCase' );
    expect( nlp.readDoc( 'THE' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'upperCase' );
    expect( nlp.readDoc( 'ThE' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
    expect( nlp.readDoc( '1' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
    expect( nlp.readDoc( '.' ).tokens().itemAt( 0 ).out( its.case ) ).to.equal( 'other' );
  } );

  it( 'its.normal', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'THE' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'ThE' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'the' );
    expect( nlp.readDoc( '1' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( '1' );
    expect( nlp.readDoc( 'recognise' ).tokens().itemAt( 0 ).out( its.normal ) ).to.equal( 'recognize' );
    expect( nlp.readDoc( 'can\'t' ).tokens().out( its.normal ) ).to.deep.equal( [ 'can', 'not' ] );
  } );

  // This needs to be re-written once pos tagging is enabled.
  it( 'its.pos', function () {
    expect( nlp.readDoc( 'the' ).tokens().itemAt( 0 ).out( its.pos ) ).to.equal( 'DET' );
  } );

  it( 'its.precedingSpaces', function () {
    expect( nlp.readDoc( 'the   3' ).tokens().itemAt( 1 ).out( its.precedingSpaces ) ).to.equal( '   ' );
  } );

  it( 'its.prefix', function () {
    expect( nlp.readDoc( 'prefix' ).tokens().itemAt( 0 ).out( its.prefix ) ).to.equal( 'pr' );
  } );

  it( 'its.suffix', function () {
    expect( nlp.readDoc( 'suffix' ).tokens().itemAt( 0 ).out( its.suffix ) ).to.equal( 'fix' );
  } );

  it( 'its.shape', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xxx' );
    expect( nlp.readDoc( 'TheOne' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'XxxXxx' );
    expect( nlp.readDoc( 'A1' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xd' );
    expect( nlp.readDoc( 'Abcdef123456' ).tokens().itemAt( 0 ).out( its.shape ) ).to.equal( 'Xxxxxdddd' );
  } );

  it( 'its.type', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'word' );
    expect( nlp.readDoc( '22.4' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'number' );
    expect( nlp.readDoc( 'myhotmail@gmail.com' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'email' );
    expect( nlp.readDoc( '@Oracle' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'mention' );
    expect( nlp.readDoc( '#hash' ).tokens().itemAt( 0 ).out( its.type ) ).to.equal( 'hashtag' );
  } );

  it( 'its.value', function () {
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.value ) ).to.equal( 'The' );
  } );

  it( 'its.uniqueId', function () {
    expect( nlp.readDoc( '$%^oov^%$' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 0 );
    expect( nlp.readDoc( '\n' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 1 );
    expect( nlp.readDoc( 'The' ).tokens().itemAt( 0 ).out( its.uniqueId ) ).to.equal( 77051 );
  } );

  it( 'its.negationFlag', function () {
    expect( nlp.readDoc( 'I did not like.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'like' ] );
    expect( nlp.readDoc( 'Not good co. I am ok.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'good' ] );
    expect( nlp.readDoc( 'not good, but ok.' ).tokens().filter( ( t ) => ( t.out( its.negationFlag ) ) ).out() ).to.deep.equal( [ 'good' ] );
  } );

  it( 'its.stopWordFlag', function () {
    // Use contraction to ensure expansions are tested properly.
    expect( nlp.readDoc( 'I didn\'t like.' ).tokens().out( its.stopWordFlag ) ).to.deep.equal( [ true, true, true, false, false ] );
  } );

  it( 'its.abbrevFlag', function () {
    expect( nlp.readDoc( 'I. K. Raj worked for Google Inc.' ).tokens().out( its.abbrevFlag ) ).to.deep.equal( [ true, true, false, false, false, false, true ] );
  } );

  it( 'its.contractionFlag', function () {
    expect( nlp.readDoc( 'I can\'t go' ).tokens().out( its.contractionFlag ) ).to.deep.equal( [ false, true, true, false ] );
  } );

  it( 'its.sentiment', function () {
    expect( nlp.readDoc( 'I am sick' ).out( its.sentiment ) ).to.deep.equal( -0.4 );
  } );

  it( 'its.lemma', function () {
    expect( nlp.readDoc( 'He is hiding' ).tokens().out( its.lemma ) ).to.deep.equal( [ 'he', 'be', 'hide' ] );
    expect( nlp.readDoc( 'I organised' ).tokens().out( its.lemma ) ).to.deep.equal( [ 'i', 'organize' ] );
    expect( nlp.readDoc( 'how abt eating' ).tokens().out( its.lemma ) ).to.deep.equal( [ 'how', 'about', 'eat' ] );
    expect( nlp.readDoc( 'I can\'t be going.' ).tokens().out( its.lemma ) ).to.deep.equal( [ 'i', 'can', 'not', 'be', 'go', '.' ] );
  } );

  it( 'its.stem', function () {
    const doc = nlp.readDoc( 'decisively wanted ate' );
    expect( doc.out( its.stem ) ).to.deep.equal( 'decis want ate' );
    expect( doc.sentences().itemAt( 0 ).out( its.stem ) ).to.deep.equal( 'decis want ate' );
    expect( doc.tokens().out( its.stem ) ).to.deep.equal( [ 'decis', 'want', 'ate' ] );
    expect( doc.tokens().itemAt( 1 ).out( its.stem ) ).to.deep.equal( 'want' );
  } );

  it( 'its.readabilityStats', function () {
    const text = `The summer evening had begun to fold the world in its mysterious
    embrace. Far away in the west the sun was setting and the last glow of
    all too fleeting day lingered lovingly on sea and strand, on the proud
    promontory of dear old Howth guarding as ever the waters of the bay, on
    the weedgrown rocks along Sandymount shore and, last but not least, on
    the quiet church whence there streamed forth at times upon the stillness
    the voice of prayer to her who is in her pure radiance a beacon ever to
    the stormtossed heart of man, Mary, star of the sea.`;
    const rs = {
      complexWords: {
        mysterious: 1,
        promontory: 1
      },
      numOfComplexWords: 2,
      fres: 43,
      numOfSentences: 2,
      numOfTokens: 119,
      numOfWords: 104,
      readingTimeMins: 0,
      readingTimeSecs: 26,
      sentiment: 0.33
    };
    const doc = nlp.readDoc( text );
    expect( doc.out( its.readabilityStats ) ).to.deep.equal( rs );
  } );

  it( 'its.sentenceWiseImportance', function () {
    const text = `Children living in Japan’s hottest city will be given specially designed umbrellas to protect them
    from the heat, after a summer that saw record-breaking temperatures in many parts of the country.Local authorities
    in Kumagaya in Saitama prefecture have devised an umbrella that keeps out the rain and doubles as a parasol, 
    the Mainichi Shimbun reported. The umbrellas, which bear the city’s logo and weigh just 336 grams, will be distributed
    to 9,000 primary schoolchildren next week, the newspaper said. Kumagaya, a city of about 195,000 located 60km north of
    Tokyo, regularly records the highest temperatures in Japan partly as a result of warm downslope winds created by the
    Foehn Effect. The city’s government has for the past two years advised younger children to shield themselves from the
    sun with regular umbrellas on their way to and from school to prevent heatstroke, but some questioned their ability to
    block out sunlight. Alarmed by a rise in the number of days when the mercury rises to at least 35C, the city decided
    to hand out the yellow fibreglass umbrellas, including to children who live in Kumagaya but attend schools outside the
    city, the Mainichi said. The heat-busting brollies will also force children to maintain a reasonable distance from
    each other, eliminating the need for them to wear masks to prevent the spread of the coronavirus, it added. The measure
    has come a little late in the day, however. Japan battled its worst heatwave since records began in 1875 in late June,
    after a premature end to the rainy season. The city of Isesaki, north of Tokyo, registered the country’s highest-ever
    temperature for that month, at 40.2C, beating the previous June record of 39.8C set in 2011. Tokyo experienced several
    consecutive days of 35C-plus heat, prompting the government to warn people to save energy or face power cuts, while
    Kumagaya and five other locations marked highs above 40C on 1 July. Kumagaya’s reputation for furnace-like temperatures
    was sealed in July 2018, when it battled an all-time high temperature of 41.1C – an unenviable record it shares with the
    city of Hamamatsu in central Japan. On Friday, the maximum temperature for Kumagaya was a far more comfortable 26C,
    according to the meteorological agency, although it forecast a rerun to the low 30s next week. Officials had hoped to
    distribute the umbrellas before the school summer holidays began were delayed by the Covid-19 pandemic. Global heating
    has prompted Japan’s government to take extra measures and issue a slew of advice on how to prevent heatstroke.
    Almost all classrooms in public primary and middle schools now have air conditioners, according to the Asahi Shimbun,
    while the education ministry last year urged teachers to instruct children to wear cool clothing and hats, and to
    keep hydrated when they travel to and from school. The pandemic has frustrated attempts to keep children cool at school,
    however, with teachers reporting that many are reluctant to remove their masks, even with encouragement from staff.`;

    const rank = [
      { 'importance': 0.9667, 'index': 0 },
      { 'importance': 0.1667, 'index': 1 },
      { 'importance': 0.1333, 'index': 2 },
      { 'importance': 0.6667, 'index': 3 },
      { 'importance': 0.5, 'index': 4 },
      { 'importance': 0.9333, 'index': 5 },
      { 'importance': 1, 'index': 6 },
      { 'importance': 0, 'index': 7 },
      { 'importance': 0.3667, 'index': 8 },
      { 'importance': 0.6333, 'index': 9 },
      { 'importance': 0.9667, 'index': 10 },
      { 'importance': 0.4, 'index': 11 },
      { 'importance': 0.8333, 'index': 12 },
      { 'importance': 0.3667, 'index': 13 },
      { 'importance': 0.1333, 'index': 14 },
      { 'importance': 0.8333, 'index': 15 },
      { 'importance': 0.3, 'index': 16 }
    ];

    expect( nlp.readDoc( text ).out( its.sentenceWiseImportance ) ).to.deep.equal( rank );
    expect( nlp.readDoc( 'text' ).out( its.sentenceWiseImportance ) ).to.deep.equal( [ { index: 0, importance: 0 } ] );
    expect( nlp.readDoc( '' ).out( its.sentenceWiseImportance ) ).to.deep.equal( [ { index: 0, importance: 0 } ] );
  } );

  it( 'selected entity with its.detail, its.span as.?', function () {
    const s = 'Conut downn starts from ten, nine, eight...';
    const se = nlp.readDoc( s ).entities().filter( ( e ) => ( e.out( its.type ) === 'CARDINAL' ) );
    expect( se.out( its.span, as.freqTable ) ).to.deep.equal( [ [ 4, 4 ], [ 6, 6 ], [ 8, 8 ] ] );
    expect( se.out( its.detail, as.freqTable ) ).to.deep.equal( [ { type: 'CARDINAL', value: 'ten' }, { type: 'CARDINAL', value: 'nine' }, { type: 'CARDINAL', value: 'eight' } ] );
    expect( se.out( its.type, as.freqTable ) ).to.deep.equal( [ [ 'CARDINAL', 3 ] ] );
  } );

  it( 'stubs test', function () {
    const v = ( new Array( 100 ) ).fill( 0 );
    expect( its.vector( ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).tokens().out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).tokens().itemAt( 0 ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are 3 vectors' ).tokens().filter( ( t ) => ( t.out( its.type ) === 'word' ) ).out( its.vector ) ).to.deep.equal( v );
    expect( nlp.readDoc( 'there are no vectors' ).sentences().out( its.vector ) ).to.deep.equal( [ v ] );
    expect( its.detail() ).to.deep.equal( true );
  } );
} );
