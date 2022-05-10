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

var allowed = require( './allowed.js' );
var its = require( '../src/its.js' );
var helper = require( '../src/helper.js' );

// Norm computation helper connstants and functions.
const L2 = 'l2';
const NONE = 'none';
const normFn = Object.create( null );

/**
 * Computes absolute value of `v` for l1 norm.
 *
 * @param  {number} v   values whose abs is computed.
 * @return {number}     absolute value of v.
 */
normFn.l1 = ( ( v ) => ( Math.abs( v ) ) );

/**
 * Computes square of `v` for l2 norm.
 *
 * @param  {number} v   values whose square is computed.
 * @return {number}     square of v.
 */
normFn.l2 = ( ( v ) => (  v * v ) );

/**
 * Returns 0, used when norm is none.
 *
 * @return {number}     0 value.
 */
normFn.none = ( () => ( 0 ) );

/**
 * Validates the input config's numeric parameter, if in valid the returns
 * the default value.
 * @param  {Number} num        input number to be validated.
 * @param  {Number} numDefault default value that is used if the input num is invalid.
 * @param  {Number} min        used for testing num < min.
 * @param  {[type]} max        used for testing num > max.
 * @return {[type]}            input number of default value.
 */
const getValidCfgNum = function ( num, numDefault, min, max ) {
  return (
              ( num === null ) ||
              ( num === undefined ) ||
              ( typeof num !== 'number' ) ||
              ( num < min || num > max )
            ) ? numDefault : num;
}; // getValidCfgNum()

// # bm25Vectorizer
/**
 * Creates an instance of BM25-based vectorizer using the `config`.
 *
 * @param  {object}     config defines values of various BM25 configuration params —
 *                      k, k1, b and normalization scheme — none, l1, or l2.
 * @return {undefined}  Nothing!
 */
var bm25Vectorizer = function ( config ) {
  const cfg =  ( helper.isObject( config ) ) ? config : Object.create( null );
  // Setup BM25 Parameters.
  const k = getValidCfgNum( cfg.k, 1, 0, 100 );
  const k1 = getValidCfgNum( cfg.k1, 1.2, 0, 100 );
  const b = getValidCfgNum( cfg.b, 0.75, 0, 1 );
  // Setup precision.
  const precision = getValidCfgNum( cfg.precision, 6, 1, 12 );
  // Setup norm.
  const norm = (
                 ( cfg.norm === null ) ||
                 ( cfg.norm === undefined ) ||
                 ( normFn[ cfg.norm ] === undefined )
              ) ? NONE : cfg.norm;

  // Document Id; it is incremented at the end of each `learn()` call.
  var docId = 0;
  // Term frequencies. The raw `tf` builds up here during learning. Subsequently
  // the same is updated using BM25 formula during wieght computation.
  var tf = [];
  // Length of each document in terms of number of tokens.
  var docLength = [];
  // Sum of all document's length, used for average DL computation.
  var sumOfAllDLs = 0;
  // Inverse Document Frequency. The raw `idf` builds up here during learning.
  // Subsequently the same is updated using BM25 formula during wieght computation.
  var idf = Object.create( null );
  // Norms value for each document.
  var norms = [];
  // Terms or features — typically to be used alongwith vector or doc term matrix
  // by the developer.
  var terms = [];
  // Useful in avoiding re-computation of final weights.
  var weightsComputed = false;
  // Returned!
  var methods = Object.create( null );

  // ## computeWeights
  /**
   * Computes & updates the TF and the IDF as per the BM25 formulae.
   *
   * @return {undefined} Nothing!
   */
  var computeWeights = function () {
    // If weights have been computed, then re-computation is not allowed.
    if ( weightsComputed ) return;
    if ( docId === 0 ) throw Error( 'wink-nlp: this operation doesn\'t make sense without any learning; use learn() API first.' );
    // Set the average document length used for normalization.
    const avgDL = sumOfAllDLs / docId;
    // Compute IDF.
    for ( const t in idf ) { // eslint-disable-line guard-for-in
      // Equation 3.3 in "Probabilistic Relevance Framework BM25 and Beyond" by
      // Stephen Robertson and Hugo Zaragoza
      idf[ t ] = +Math.log( ( ( docId - idf[ t ] + 0.5 ) / ( idf[ t ] + 0.5 ) ) + k ).toFixed( precision );
    }
    // Compute the TF for every documet.
    for ( let id = 0; id < docId; id += 1 ) {
      for ( const t in tf[ id ] ) { // eslint-disable-line guard-for-in
        // Equation 3.15 with modification described in section on "Some Variations on BM25"
        // (3.5.1) of "Probabilistic Relevance Framework BM25 and Beyond" by
        // Stephen Robertson and Hugo Zaragoza
        // IDF * ((k + 1) * tf) / (k * (1.0 - b + b * (|d|/avgDl)) + tf)
        tf[ id ][ t ] = idf[ t ] * ( ( k1 + 1 ) * tf[ id ][ t ] ) / ( ( k1 * ( 1 - b + ( b * ( docLength[ id ] / avgDL ) ) ) ) + tf[ id ][ t ] );
        // Compute the norm incrementally; will eventually use it as the divisor
        // at the time of final computation in the next loop.
        norms[ id ] += normFn[ norm ]( tf[ id ][ t ] );
      }

      // Compute norm, if none then we set norms[ id ] to 1 and divide by 1 has
      // no effect!
      if ( norm === L2 ) {
        norms[ id ] = Math.sqrt( norms[ id ] );
      } else if ( norm === NONE ) norms[ id ] = 1;

      for ( const t in tf[ id ] ) { // eslint-disable-line guard-for-in
        tf[ id ][ t ] = +( tf[ id ][ t ] / norms[ id ] ).toFixed( precision );
      }
    }
    // Extract terms sorted alphabetically — vectors & matrix follow this order.
    terms = Object.keys( idf ).sort();
    // Set weightsComputed.
    weightsComputed = true;
  }; // computeWeights()

  // ## learn
  /**
   *
   * Builds raw TF and IDF from the tokenized input document. Throws error if
   * call to out has been made — because out updates the raw tf-idf values as
   * per the BM25 formulae.
   *
   * @param  {string[]}   tokens  tokenized document, usually obtained via winkNLP.
   * @return {undefined}          nothing.
   */
  methods.learn = function ( tokens ) {
    if ( weightsComputed ) throw Error( 'wink-nlp: learn can not be used after a call to out() API in BM25 Vectorizer' );
    // It will contain the TF i.e.bag-of-words for this document — `docId`.
    const bow = Object.create( null );
    // Set the length of this document.
    docLength[ docId ] = tokens.length;
    // Build TF and keep updating the IDF.
    for ( let i = 0; i < tokens.length; i += 1 ) { // eslint-disable-line guard-for-in
      const t = tokens[ i ];
      if ( bow[ t ] === undefined ) {
        bow[ t ] = 1;
        // Increment doc count for this token; note it will happen only once whenever
        // we encounter a token unnseen so far.
        idf[ t ] = 1 + ( idf[ t ] || 0 );
      } else {
        // Token has been seen, simply increment.
        bow[ t ] += 1;
      }
    }
    // Save this TF at `docId` location.
    tf.push( bow );
    norms.push( 0 );
    // Update sum, will be used to compute the average DL later.
    sumOfAllDLs += docLength[ docId ];
    // Get ready to process the next document.
    docId += 1;
  }; // learn()

  // ## out
  /**
   * Produces out put according to the input function. Operates at vecorizer level.
   *
   * @param  {function} f   a function that determins the output format/content.
   * @return {array}        array containing either strings, objects or arrays.
   */
  methods.out = function ( f ) {
    computeWeights();
    // Pass `docId` & `sumOfAllDLs` in additionn to `tf`, `idf` & `terms`; this
    // is needed while saving the model JSON.
    if ( allowed.its4BM25.has( f ) ) return f( tf, idf, terms, docId, sumOfAllDLs );
    // In case of innvalid `f`, fall back to the default method — `docBOWArray`.
    return its.docBOWArray( tf, idf, terms, docId, sumOfAllDLs );
  }; // out()

  // ## doc
  /**
   * Returns the APIs applicable to the document specified by its index.
   *
   * @param  {numebr} n index of the document.
   * @return {object}   object containing `out()` and `length()` methods.
   */
  methods.doc = function ( n ) {
    const api = Object.create( null );

    // ## doc.out
    /**
     * Produces out put according to the input function. Operates at the document
     * level.
     *
     * @param  {function} f   a function that determins the output format/content.
     * @return {array}        array containing either strings, objects or arrays.
     */
    api.out = function ( f ) {
      computeWeights();
      if ( f === its.bow ) return f( tf[ n ] );
      if ( f === its.vector ) {
        const arr = new Array( terms.length );
        for ( let i = 0; i < terms.length; i += 1 ) {
          arr[ i ] = tf[ n ][ terms[ i ] ] || 0;
        }
        return arr;
      }
      if ( f === its.tf ) return f( tf[ n ] );
      return tf[ n ]; // its.bow — default fall back.
    }; // doc.out()

    // ## doc.length
    /**
     *
     * Returns the number of unique tokens in the n<sup>th</sup> document.
     *
     * @return {number} the number of unique tokens in the document.
     */
    api.length = function () {
      return ( tf.length === 0 ) ? 0 : Object.keys( tf[ n ] ).length;
    }; // doc.length()

    return api;
  }; // doc()

  // ## vectorOf
  /**
   * Computes the vector of the input document given in form of tokens using
   * the tf-idf learned so far.
   * @param  {string[]}   tokens  tokenized document, usually obtained via winkNLP.
   * @return {number[]}           its vector.
   */
  methods.vectorOf = function ( tokens ) {
    computeWeights();
    const arr = new Array( terms.length );
    const bow = Object.create( null );
    const avgDL = sumOfAllDLs / docId;
    let thisNorm = 0;

    for ( let i = 0; i < tokens.length; i += 1 ) {
      const t = tokens[ i ];
      bow[ t ] = 1 + ( bow[ t ] || 0 );
    }

    for ( let i = 0; i < terms.length; i += 1 ) {
      const t = terms[ i ];
      arr[ i ] = bow[ t ] || 0;
      arr[ i ] = idf[ t ] * ( ( k1 + 1 ) * arr[ i ] ) / ( ( k1 * ( 1 - b + ( b * ( tokens.length / avgDL ) ) ) ) + arr[ i ] );
      thisNorm += normFn[ norm ]( arr[ i ] );
    }
    if ( norm === L2 ) {
      thisNorm = Math.sqrt( thisNorm );
    } else if ( norm === NONE ) thisNorm = 1;

    // `thisNorm || 1` ensures that there is no attempt to divide by zero!
    // This may happen if all tokens are unseen.
    return arr.map( ( v ) => +( v / ( thisNorm || 1 ) ).toFixed( precision ) );
  }; // vectorOf()

  // ## bowOf
  /**
   * Computes the bag-of-words (bowOf) of the input document, using the tf-idf
   * learned so far. If `processOOV` is true then for OOV token's frequency is
   * computed and its `idf` is assumed to be **1**; otherwise all OOVs are ignored.
   * @param  {string[]}   tokens      tokenized text, usually obtained via winkNLP.
   * @param  {boolean}    processOOV  true — process OOV, false — ignore OOV (default).
   * @return {object}                 its bow.
   */
  methods.bowOf = function ( tokens, processOOV = false ) {
    computeWeights();
    const bow = Object.create( null );
    const avgDL = sumOfAllDLs / docId;
    let thisNorm = 0;

    if ( typeof processOOV !== 'boolean' ) {
      throw Error( 'wink-nlp: processOOV must be a boolean.' );
    }

    for ( let i = 0; i < tokens.length; i += 1 ) {
      const t = tokens[ i ];
      // `processOOV` true means count every term otherwise count only if it is
      // in the vocabulary i.e. `idf`.
      if ( processOOV ) {
        bow[ t ] = 1 + ( bow[ t ] || 0 );
      } else if ( idf[ t ] ) bow[ t ] = 1 + ( bow[ t ] || 0 );
    }

    for ( const t in bow ) { // eslint-disable-line guard-for-in
      // `bow` tokens are determined by `processOOV` i.e. if true it will contain
      // OOVs also otherwise it will not have any OOV. On the other hand `idf`
      // always contains all the seen tokens. Therefore when `processOOV` is true,
      // the `idf[ t ]` for all OOV will be taken as **1** (highest possible value).
      bow[ t ] = ( idf[ t ] || 1 ) * ( ( k1 + 1 ) * bow[ t ] ) / ( ( k1 * ( 1 - b + ( b * ( tokens.length / avgDL ) ) ) ) + bow[ t ] );
      thisNorm += normFn[ norm ]( bow[ t ] );
    }

    if ( norm === L2 ) {
      thisNorm = Math.sqrt( thisNorm );
    } else if ( norm === NONE ) thisNorm = 1;

    for ( const t in bow ) { // eslint-disable-line guard-for-in
      // Unlike in `vectorOf`, `thisNorm || 1` is not needed here as bow will be
      // empty if `thisNorm` is zero!
      bow[ t ] = +( bow[ t ] / thisNorm ).toFixed( precision );
    }

    return bow;
  }; // bowOf()

  methods.config = ( () => ( { k: k, k1: k1, b: b, norm: norm } ) );

  // ## loadModel
  /**
   * Loads the input model JSON into the BM25's respective data structure. Throws
   * error if invalid JSON or model is passed. Sets `weightsComputed` to true to
   * prevent further learning.
   * @param  {string} json  Input model's JSON string.
   * @return {void}         Nothing!
   */
  methods.loadModel = function ( json ) {
    // Used to check presence of required fields; `uid` is checked separately.
    const modelFields = [ 'docId', 'tf', 'idf', 'terms', 'sumOfAllDLs' ];

    let model;

    if ( docId > 0 ) throw Error( 'wink-nlp: can not load model after learning.' );

    try {
      model = JSON.parse( json );
    } catch (e) {
      throw Error( `wink-nlp: invalid input JSON:\n\t${e}\n\n` );
    }

    if ( helper.isObject( model ) && ( Object.keys( model ).length === 6 ) && ( model.uid === 'WinkNLP-BM25Vectorizer-Model/1.0.0' ) ) {
      // Check presence of all required fields.
      modelFields.forEach( ( f ) => {
        if ( model[ f ] === undefined ) throw Error( 'wink-nlp: invalid model format/version' );
      } );

      // All good, set fields.
      docId = model.docId;
      tf = model.tf;
      idf = model.idf;
      terms = model.terms;
      sumOfAllDLs = model.sumOfAllDLs;

      // To prevent further learning.
      weightsComputed = true;
    } else {
      throw Error( 'wink-nlp: invalid model format/version' );
    }
  }; // loadModel()

  return methods;
}; // bm25Vectorizer()

module.exports = bm25Vectorizer;
