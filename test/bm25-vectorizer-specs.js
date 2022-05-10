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
var bm25 = require( '../utilities/bm25-vectorizer.js' );
var similarity = require( '../utilities/similarity.js' );
var its = require( '../src/its.js' );


var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'bm25-vectorizer', function () {
  describe( 'configurations', function () {
    it( 'empty config should return default values', function () {
      expect( bm25().config() ).to.deep.equal( { k: 1, k1: 1.2, b: 0.75, norm: 'none' } );
    } );

    it( 'null config should return default values', function () {
      expect( bm25().config( { k: null, k1: null, b: null, norm: null } ) ).to.deep.equal( { k: 1, k1: 1.2, b: 0.75, norm: 'none' } );
    } );

    it( 'NaN/non-string config should return default values', function () {
      expect( bm25( { k: [], k1: {}, b: 'null', norm: 'null' } ).config() ).to.deep.equal( { k: 1, k1: 1.2, b: 0.75, norm: 'none' } );
    } );

    it( '-ve values in config should return default values', function () {
      expect( bm25( { k: -1, k1: -1, b: -1, norm: 'null' } ).config() ).to.deep.equal( { k: 1, k1: 1.2, b: 0.75, norm: 'none' } );
    } );

    it( 'large +ve values in config should return default values', function () {
      expect( bm25( { k: 101, k1: 101, b: 2, norm: 'null' } ).config() ).to.deep.equal( { k: 1, k1: 1.2, b: 0.75, norm: 'none' } );
    } );

    it( 'valid values in config should return defined values', function () {
      expect( bm25( { k: 2, k1: 1.5, b: 0.6, norm: 'l2' } ).config() ).to.deep.equal( { k: 2, k1: 1.5, b: 0.60, norm: 'l2' } );
    } );
  } );

  describe( 'out() should throw error without any learnings, whereas length() should work', function () {
    const v = bm25();
    it( 'should throw error without any learnning on out()', function () {
      expect( v.out.bind() ).to.throw( 'wink-nlp: this operation doesn\'t make sense without any learning; use learn() API first.' );
    } );

    it( 'doc.out() should return undefined', function () {
      expect( v.doc( 0 ).out.bind() ).to.throw( 'wink-nlp: this operation doesn\'t make sense without any learning; use learn() API first.' );
    } );

    it( 'doc.out() should return undefined', function () {
      expect( v.doc( 0 ).length() ).to.equal( 0 );
    } );
  } );

  describe( 'learn from 1-document', function () {
    const bow = { rain: 0.395563, go: 0.287682, away: 0.287682 };
    const json = '{"uid":"WinkNLP-BM25Vectorizer-Model/1.0.0","tf":[{"rain":0.395563,"go":0.287682,"away":0.287682}],"idf":{"rain":0.287682,"go":0.287682,"away":0.287682},"terms":["away","go","rain"],"docId":1,"sumOfAllDLs":4}';
    const v = bm25();
    v.learn( 'rain rain go away'.split( /\s+/g ) );

    it( 'out() should return [ bow ]', function () {
      expect( v.out() ).to.deep.equal( [ bow ] );
    } );

    it( 'out( its.bow ) should return [ bow ]', function () {
      expect( v.out( its.bow ) ).to.deep.equal( [ bow ] );
    } );

    it( 'out( its.docTermMatrix ) should return document term matrix', function () {
      expect( v.out( its.docTermMatrix ) ).to.deep.equal( [ [ 0.287682, 0.287682, 0.395563 ] ] );
    } );

    it( 'out( its.docBOWArray ) should return [ bow ]', function () {
      expect( v.out( its.docBOWArray ) ).to.deep.equal( [ bow ] );
    } );

    it( 'out( its.idf ) should return [ bow ]', function () {
      expect( v.out( its.idf ) ).to.deep.equal( [ [ 'away', 0.287682 ], [ 'go', 0.287682 ], [ 'rain', 0.287682 ] ] );
    } );

    it( 'out( its.terms ) should return sorted array of terms', function () {
      expect( v.out( its.terms ) ).to.deep.equal( [ 'away', 'go', 'rain' ] );
    } );

    it( 'out( its.modelJSON ) should return models JSON', function () {
      expect( v.out( its.modelJSON ) ).to.deep.equal( json );
    } );

    it( 'vectorOf() should return vector of tokens', function () {
      expect( v.vectorOf( [ 'rain', 'is', 'going', 'away' ] ) ).to.deep.equal( [ 0.287682, 0, 0.287682 ] );
    } );

    it( 'bowOf() should return bow of tokens', function () {
      expect( v.bowOf( [ 'rain', 'is', 'going', 'away' ] ) ).to.deep.equal( { away: 0.287682, rain: 0.287682 } );
    } );

    it( 'doc.out( its.tf ) should return freq table of terms', function () {
      expect( v.doc( 0 ).out( its.tf ) ).to.deep.equal( [ [ 'rain', 0.395563 ], [ 'away', 0.287682 ], [ 'go', 0.287682 ] ] );
    } );

    it( 'doc.out() should return freq table of terms', function () {
      // To test its.bow — default fall back.
      expect( v.doc( 0 ).out() ).to.deep.equal( { rain: 0.395563, away: 0.287682, go: 0.287682 } );
    } );


    it( 'doc.out( its.vector ) should return its vector', function () {
      expect( v.doc( 0 ).out( its.vector ) ).to.deep.equal( [ 0.287682, 0.287682, 0.395563 ] );
    } );

    it( 'doc.out( its.bow ) should return its bow', function () {
      expect( v.doc( 0 ).out( its.bow ) ).to.deep.equal( bow );
    } );

    it( 'doc.length() should return 3', function () {
      expect( v.doc( 0 ).length() ).to.equal( 3 );
    } );
  } );

  describe( 'learn from multiple documents with l2 norm', function () {
    const terms = [ 'are', 'black', 'blue', 'cats', 'rats', 'some', 'white' ];
    const idf = [
      [ 'black', 0.980829 ],
      [ 'blue', 0.980829 ],
      [ 'cats', 0.980829 ],
      [ 'some', 0.980829 ],
      [ 'white', 0.980829 ],
      [ 'rats', 0.470004 ],
      [ 'are', 0.133531 ]
    ];
    const dtm = [
      [ 0.121858, 0, 0.895087, 0, 0.428917, 0, 0 ],
      [ 0.095823, 0, 0, 0.703853, 0, 0, 0.703853 ],
      [ 0.086275, 0.633717, 0, 0, 0.435158, 0.633717, 0 ]
    ];
    const v = bm25( { norm: 'l2' } );
    v.learn( 'rats are blue'.split( /\s+/g ) );
    v.learn( 'cats are white'.split( /\s+/g ) );
    v.learn( 'some rats rats are black'.split( /\s+/g ) );

    it( 'doc.out( its.vector ) should return its vector', function () {
      expect( v.doc( 2 ).out( its.vector ) ).to.deep.equal( [ 0.086275, 0.633717, 0, 0, 0.435158, 0.633717, 0 ] );
    } );

    it( 'out( its.idf ) should return its idfs freq table', function () {
      expect( v.out( its.idf ) ).to.deep.equal( idf );
    } );

    it( 'out( its.terms ) should return its doc terms in alpha sort', function () {
      expect( v.out( its.terms ) ).to.deep.equal( terms );
    } );

    it( 'out( its.docTermMatrix ) should return its doc term matrix', function () {
      expect( v.out( its.docTermMatrix ) ).to.deep.equal( dtm );
    } );

    it( 'vectorOf() should return its vector', function () {
      expect( v.vectorOf( 'rats were blue'.split( /\s+/g ) ) ).to.deep.equal( [ 0, 0, 0.901808, 0, 0.432138, 0, 0 ] );
    } );

    it( 'bowOf() should return its bow', function () {
      expect( v.bowOf( 'rats were blue'.split( /\s+/g ) ) ).to.deep.equal( { blue: 0.901808, rats: 0.432138 } );
    } );
  } );

  describe( 'learn from multiple documents with l1 norm', function () {
    const terms = [ 'are', 'black', 'blue', 'cats', 'rats', 'some', 'white' ];
    const idf = [
      [ 'black', 0.980829 ],
      [ 'blue', 0.980829 ],
      [ 'cats', 0.980829 ],
      [ 'some', 0.980829 ],
      [ 'white', 0.980829 ],
      [ 'rats', 0.470004 ],
      [ 'are', 0.133531 ]
    ];
    const dtm = [
      [ 0.084281, 0, 0.619068, 0, 0.296652, 0, 0 ],
      [ 0.063732, 0, 0, 0.468134, 0, 0, 0.468134 ],
      [ 0.048229, 0.354256, 0, 0, 0.243259, 0.354256, 0 ]
    ];
    const v = bm25( { norm: 'l1' } );
    v.learn( 'rats are blue'.split( /\s+/g ) );
    v.learn( 'cats are white'.split( /\s+/g ) );
    v.learn( 'some rats rats are black'.split( /\s+/g ) );

    it( 'doc.out( its.vector ) should return its vector', function () {
      expect( v.doc( 2 ).out( its.vector ) ).to.deep.equal( [ 0.048229, 0.354256, 0, 0, 0.243259, 0.354256, 0 ] );
    } );

    it( 'out( its.idf ) should return its idfs freq table', function () {
      expect( v.out( its.idf ) ).to.deep.equal( idf );
    } );

    it( 'out( its.terms ) should return its doc terms in alpha sort', function () {
      expect( v.out( its.terms ) ).to.deep.equal( terms );
    } );

    it( 'out( its.docTermMatrix ) should return its doc term matrix', function () {
      expect( v.out( its.docTermMatrix ) ).to.deep.equal( dtm );
    } );

    it( 'should throw error learn() is called after out()', function () {
      expect( v.learn.bind( null, [ 'hello', 'world' ] ) ).to.throw( 'wink-nlp: learn can not be used after a call to out() API in BM25 Vectorizer' );
    } );
  } );

  describe( 'values of TF & IDF', function () {
    const v = bm25( { norm: 'l1' } );
    // johann: `ln( 1 + ( ( 4 - 2 + 0.5 ) / ( 2 + 0.5 ) ) ) = 0.693147181`
    // bach: `ln( 1 + ( ( 4 - 4 + 0.5 ) / ( 4 + 0.5 ) ) ) = 0.105360516`
    const model = '{"uid":"WinkNLP-BM25Vectorizer-Model/1.0.0","tf":[{"bach":1},{"j":0.919531,"bach":0.080469},{"johann":0.346144,"s":0.601241,"bach":0.052615},{"johann":0.346144,"sebastian":0.601241,"bach":0.052615}],"idf":{"bach":0.105361,"j":1.203973,"johann":0.693147,"s":1.203973,"sebastian":1.203973},"terms":["bach","j","johann","s","sebastian"],"docId":4,"sumOfAllDLs":9}';
    v.learn( 'Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'J Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann S Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann Sebastian Bach'.toLowerCase().split( /\s+/g ) );

    it( 'should return correct idf values', function () {
      expect( v.out( its.modelJSON ) ).to.equal( model );
    } );
  } );

  describe( 'completely OOV tokens with l1 norm', function () {
    const v = bm25( { norm: 'l1' } );
    v.learn( 'Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'J Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann S Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann Sebastian Bach'.toLowerCase().split( /\s+/g ) );

    it( 'should return 0-vector', function () {
      expect( v.vectorOf([ 'cat', 'cat', 'green', 'is' ] ) ).to.deep.equal( [ 0, 0, 0, 0, 0 ] );
    } );

    it( 'should return empty bow', function () {
      expect( v.bowOf([ 'cat', 'cat', 'green', 'is' ] ) ).to.deep.equal( {} );
    } );
  } );

  describe( 'completely OOV tokens with l2 norm', function () {
    const v = bm25( { norm: 'l2' } );
    v.learn( 'Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'J Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann S Bach'.toLowerCase().split( /\s+/g ) );
    v.learn( 'Johann Sebastian Bach'.toLowerCase().split( /\s+/g ) );

    it( 'should return 0-vector', function () {
      expect( v.vectorOf([ 'cat', 'cat', 'green', 'is' ] ) ).to.deep.equal( [ 0, 0, 0, 0, 0 ] );
    } );

    it( 'should return empty bow', function () {
      expect( v.bowOf([ 'cat', 'cat', 'green', 'is' ] ) ).to.deep.equal( {} );
    } );
  } );

  describe( 'load model json', function () {
    const v1 = bm25();
    v1.learn( 'the quick brown fox jumped over the lazy dog'.toLowerCase().split( /\s+/g ) );
    v1.learn( 'the fast fox jumped over the lazy dog'.toLowerCase().split( /\s+/g ) );
    v1.learn( 'the dog sat there and did nothing'.toLowerCase().split( /\s+/g ) );
    v1.learn( 'the other animals sat there watching'.toLowerCase().split( /\s+/g ) );

    const v2 = bm25();
    const model = v1.out( its.modelJSON );
    v2.loadModel( model );

    const v3 = bm25();

    it( 'v1 and v2 out() should match', function () {
      expect( v1.out( its.docBOWArray ) ).to.deep.equal( v2.out( its.docBOWArray ) );
      expect( v1.out( its.docTermMatrix ) ).to.deep.equal( v2.out( its.docTermMatrix ) );
      expect( v1.out( its.idf ) ).to.deep.equal( v2.out( its.idf ) );
      expect( v1.out( its.terms ) ).to.deep.equal( v2.out( its.terms ) );
      expect( v1.out( its.tf ) ).to.deep.equal( v2.out( its.tf ) );
    } );

    it( 'should throw error if learn() has been used', function () {
      expect( () => v1.loadModel('[]') ).to.throw( 'wink-nlp: can not load model after learning.' );
    } );

    it( 'should throw error if invalid JSON is used', function () {

      expect( () => v3.loadModel('[model]') ).to.throw( 'wink-nlp: invalid input JSON:' );
    } );

    it( 'should throw error if invalid model is used', function () {
      // Incorrect JSON.
      expect( () => v3.loadModel('[]') ).to.throw( 'wink-nlp: invalid model format/version' );
      // No fields.
      expect( () => v3.loadModel('{}') ).to.throw( 'wink-nlp: invalid model format/version' );
      // Incorrect UID.
      expect( () => v3.loadModel( JSON.stringify( { uid: 'junk' } ) ) ).to.throw( 'wink-nlp: invalid model format/version' );
      // Missing required fields.
      expect( () => v3.loadModel( JSON.stringify( { uid: 'WinkNLP-BM25Vectorizer-Model/1.0.0', 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 } ) ) ).to.throw( 'wink-nlp: invalid model format/version' );
    } );
  } );

  describe( 'similarity computation using bm25 output', function () {
    const v = bm25( { norm: 'none' } );
    v.learn( 'cat was black'.toLowerCase().split( /\s+/g ) );
    v.learn( 'dog is white'.toLowerCase().split( /\s+/g ) );
    v.learn( 'dog is cute'.toLowerCase().split( /\s+/g ) );

    it( 'completely different sentences should return 0', function () {
      const b1 = v.bowOf( 'cat is not yellow'.toLowerCase().split( /\s+/g ) );
      const b2 = v.bowOf( 'dog were rarely pink'.toLowerCase().split( /\s+/g ) );
      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 0 );
    } );

    it( 'completely different sentences with all OOV should return 1 with processOOV as false', function () {
      // This happens as both bows are empty because OOVs are ignored!
      const b1 = v.bowOf( 'ugly bat'.toLowerCase().split( /\s+/g ) );
      const b2 = v.bowOf( 'dangerous snake'.toLowerCase().split( /\s+/g ) );

      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 1 );
    } );

    it( 'completely different sentences with all OOV should return 0 with processOOV as true', function () {
      // Here OOVs are not ignored, so we get non-empty bows.
      const b1 = v.bowOf( 'ugly bat'.toLowerCase().split( /\s+/g ), true );
      const b2 = v.bowOf( 'dangerous snake'.toLowerCase().split( /\s+/g ), true );
      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 0 );
    } );

    it( 'With processOOV as non boolean, it should throw error', function () {
      expect( v.bowOf.bind( null, [ 'ugly', 'bat' ], 99 ) ).to.throw( 'wink-nlp: processOOV must be a boolean.' );
    } );

    it( 'partially different sentences should return <1', function () {
      const b1 = v.bowOf( 'cat is black'.toLowerCase().split( /\s+/g ) );
      const b2 = v.bowOf( 'dog is black'.toLowerCase().split( /\s+/g ) );
      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 0.681698 );
    } );

    it( 'identical sentences should return 1', function () {
      const b1 = v.bowOf([ 'dog is white'.toLowerCase().split( /\s+/g ) ] );
      const b2 = v.bowOf([ 'dog is white'.toLowerCase().split( /\s+/g ) ] );
      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 1 );
    } );

    it( 'empty sentences should return 1', function () {
      const b1 = v.bowOf([ ''.toLowerCase().split( /\s+/g ) ] );
      const b2 = v.bowOf([ ''.toLowerCase().split( /\s+/g ) ] );
      expect( similarity.bow.cosine( b1, b2 ) ).to.equal( 1 );
    } );
  } );
} );
