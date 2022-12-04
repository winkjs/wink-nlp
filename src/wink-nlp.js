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

var DocDataWrapper = require( './dd-wrapper.js' );
var Doc = require( './doc-v2.js' );
var Cache = require( './cache.js' );
var tokenizer = require( './tokenizer.js' );
var compileTRex = require( './compile-trex.js' );
var mappers = require( './tokens-mappers.js' );
var itsHelpers = require( './its.js' );
var asHelpers = require( './as.js' );
var mapRawTokens2UIdOfNormal = mappers.mapRawTokens2UIdOfNormal;
var mapRawTokens2UIdOfDefaultPOS = mappers.mapRawTokens2UIdOfDefaultPOS;

var Compiler = require( './examples-compiler.js' );

var constants = require( './constants.js' );

var fsm = require( './automaton.js' );

var search = require( './search.js' );
var locate = require( './locate.js' );

var helper = require( './helper.js' );

// Size of a single token.
var tkSize = constants.tkSize;

/**
 * Creates an instance of nlp.
 * @private
 *
 * @param {object} theModel language model.
 * @param {string[]} pipe of nlp annotations.
 * @returns {object} conatining set of API methods for natural language processing.
 * @example
 * const nlp = require( 'wink-nlp' );
 * var myNLP = nlp();
*/
var nlp = function ( theModel, pipe ) {

  var methods = Object.create( null );
  // Token Regex; compiled from `model`
  var trex;
  // wink-nlp language `model`.
  var model;
  // Holds instance of `cache` created using the `model`.
  var cache;
  // NLP Pipe Config.
  // var nlpPipe = Object.create( null );
  // Configured tokenize.
  var tokenize;
  // Automata
  // 1. NER
  var nerAutomata;
  var nerTransformers;
  // 2. SBD
  var sbdAutomata;
  var sbdTransformers;
  var sbdSetter;
  // 3. NEG
  var negAutomata;
  var negSetter;
  // SA
  var saAutomata;
  var saSetter;
  // POS
  var posAutomata;
  var posTransformers;
  var posSetter;
  var posUpdater;
  // Patterns or Custom Entities
  var cerAutomata;
  var cerTransformer;
  var cerLearnings = 0;
  var cerPreserve;
  var cerConfig;
  // Used for compiling examples.
  var compiler;
  // Used to innstantiate the compiler.
  var cerMetaModel;

  // Contains a list of valid annotations built from `theModel`.
  var validAnnotations = Object.create( null );

  // Current pipe.
  var currPipe = Object.create( null );
  var onlyTokenization = true;

  // Private methods.

  // ## load
  /**
   * Loads the model containing the core model along with other applicable
   * models.
   * @private
   *
   * @returns {void} nothing!.
   * @private
  */
  var load = function () {
    // Load language model.
    model = theModel.core();
    // With `intrinsicSize` captured, instantiate cache etc.
    cache = Cache( model, theModel.featureFn ); // eslint-disable-line new-cap
    trex = compileTRex( model.trex );

    // Instantiate tokenizer.
    tokenize = tokenizer( trex, model.tcat.hash, model.preserve );

    // Load & setup SBD model.
    var sbdModel = theModel.sbd();

    sbdAutomata = new Array( sbdModel.machines.length );
    sbdTransformers = new Array( sbdModel.machines.length );
    for ( let i = 0; i < sbdModel.machines.length; i += 1 ) {
      sbdAutomata[ i ] = fsm( cache );
      sbdAutomata[ i ].importJSON( sbdModel.machines[ i ] );
      sbdTransformers[ i ] = sbdModel.transformers[ i ];
    }
    sbdSetter = sbdModel.setter;

    // Load & setup NER model.
    var nerModel = theModel.ner();

    nerAutomata = new Array( nerModel.machines.length );
    nerTransformers = new Array( nerModel.machines.length );
    for ( let i = 0; i < nerModel.machines.length; i += 1 ) {
      nerAutomata[ i ] = fsm( cache );
      nerAutomata[ i ].importJSON( nerModel.machines[ i ] );
      nerTransformers[ i ] = nerModel.transformers[ i ];
    }

    var negModel = theModel.negation();
    negAutomata = fsm( cache );
    negAutomata.importJSON( negModel.machines[ 0 ] );
    negSetter = negModel.setter;

    var saModel = theModel.sa();
    saAutomata = fsm( cache );
    saAutomata.importJSON( saModel.machines[ 0 ] );
    saSetter = saModel.setter;

    var posModel = theModel.pos();
    posAutomata = new Array( posModel.machines.length );
    posTransformers = new Array( nerModel.machines.length );
    for ( let i = 0; i < posModel.machines.length; i += 1 ) {
      // Ignore only OOV literal and not new line character in the case of POS Tagging.
      posAutomata[ i ] = fsm( cache, cache.value( 0 ) );
      posAutomata[ i ].importJSON( posModel.machines[ i ] );
      posTransformers[ i ] = posModel.transformers[ i ];
    }
    posSetter = posModel.setter;
    posUpdater = posModel.updater;


    var cmModel = theModel.metaCER();
    cerMetaModel = cmModel.machines;
    cerTransformer = cmModel.transformers[ 0 ];
    // posAutomata = fsm( cache, cache.value( 0 ) );
    // posAutomata.importJSON( posModel.machines[ 0 ] );
    // posTransformer = posModel.transformers[ 0 ];
  }; // load()

  // Public Methods.
  // ## readDoc
  /**
   * Loads a single document to be processed.
   * @private
   *
   * @param {string} text of the document that you want to process.
   * @returns {object} the document in terms of an object that exposes the API.
   * @example
   * const DOC = "The quick brown fox jumps over the lazy dog";
   * myNLP.readDoc(DOC);
  */
  var readDoc = function ( text ) {
    if ( typeof text !== 'string' ) {
      throw Error( `wink-nlp: expecting a valid Javascript string, instead found "${typeof text}".`);
    }
    // Raw Document Data-structure gets populated here as NLP pipe taks execute!
    var rdd = Object.create( null );
    // The `cache` is also part of document data structure.
    rdd.cache = cache;
    // Document's tokens; each token is represented as an array of numbers:
    // ```
    // [
    //   hash, // of tokenized lexeme
    //   (nox) + preceding spaces, // expansion's normal
    //   pos + lemma, // pos & lemma are contextual
    //   negation flag // 1 bit at msb
    // ]
    // ```
    rdd.tokens = [];
    // Sentences — stored as array of pairs of `[ start, end ]` pointing to the `tokens`.
    rdd.sentences = [];
    // Markings are 4-tuples of `start`, `end` **token indexes**,  and `begin & end markers`.
    // The begin & end markers are used to markup the tokens specified.
    rdd.markings = [];
    // Publish the current annotation pipeline so that code can inquire about
    // active annotations!
    rdd.currPipe = currPipe;

    var wrappedDocData = DocDataWrapper( rdd );  // eslint-disable-line new-cap

    // Start of NLP Pipe
    tokenize( wrappedDocData, text ); // eslint-disable-line new-cap
    // Compute number of tokens.
    rdd.numOfTokens = rdd.tokens.length / tkSize;
    // This structure is identical to sentences ( or entities ), for the sake of uniformity.
    // The structure is `[ start, end, negationFlag, sentimentScore ]`.
    rdd.document = [ 0, ( rdd.numOfTokens - 1 ), 0, 0 ];

    // Map tokens for automata if there are other annotations to be performed.
    var tokens4Automata = ( onlyTokenization ) ? null : mapRawTokens2UIdOfNormal( rdd );

    var px;
    if ( currPipe.sbd ) {
      // Sentence Boundary Detection.
      // Set first `Pattern Swap (x)` as `null`.
      px = null;
      for ( let i = 0; i < sbdAutomata.length; i += 1 ) {
        sbdAutomata[ i ].setPatternSwap( px );
        // For SBD, all tokens are required to extract preceeding spaces.
        px = sbdAutomata[ i ].recognize( tokens4Automata, sbdTransformers[ i ], rdd.tokens );
      }
      // The structure of sentence is:<br/>
      // `[ start, end, negationFlag, sentimentScore ]`
      sbdSetter( px, rdd );
      // Compute number of sentences!
      rdd.numOfSentences = rdd.sentences.length;
    } else {
      // Setup default sentence as entire document!
      rdd.numOfSentences = 1;
      rdd.sentences = [ [ 0, ( rdd.numOfTokens - 1 ), 0, 0 ] ];
    }

    if ( currPipe.ner ) {
      // Named entity detection.
      px = null;
      for ( let i = 0; i < nerAutomata.length; i += 1 ) {
        nerAutomata[ i ].setPatternSwap( px );
        px = nerAutomata[ i ].recognize( tokens4Automata, nerTransformers[ i ] );
      }
      // Entities — storted as array of `[ start, end, entity type ].`
      // There are no setter for entities as no transformation is needed.
      rdd.entities = px;
    } else {
      rdd.entities = [];
    }

    if ( currPipe.negation ) {
      // Negation
      px = null;
      px = negAutomata.recognize( tokens4Automata );
      negSetter( px, rdd, constants, search );
    }

    if ( currPipe.sentiment ) {
      // Sentiment Analysis
      px = null;
      px = saAutomata.recognize( tokens4Automata );
      saSetter( px, rdd, constants, locate );
    }

    if ( currPipe.pos ) {
      // PoS Tagging
      const posTags = mapRawTokens2UIdOfDefaultPOS( rdd );
      px = null;
      for ( let i = 0; i < posAutomata.length; i += 1 ) {
        px = posAutomata[ i ].recognize( posTags, posTransformers[ 0 ], rdd.tokens );
        posUpdater( px, cache, posTags, tokens4Automata );
      }
      posSetter( rdd, posTags, tkSize, constants.bits4lemma );
    }

    if ( currPipe.cer ) {
      // Patterns
      px = null;
      if ( cerAutomata !== undefined && cerLearnings > 0 ) {
        cerConfig.rdd = rdd;
        cerConfig.preserve = cerPreserve;
        cerConfig.constants = constants;
        if ( cerConfig.useEntity ) cerAutomata.setPatternSwap( rdd.entities );
        px = cerAutomata.recognize( tokens4Automata, cerTransformer, cerConfig );
      }
      // If there are no custom entities, then `px` will be `null`; in such a case
      // set `customEntities` to an empty array.
      rdd.customEntities = px || [];
    } else rdd.customEntities = [];


    // Word Vector
    // if ( theModel.wordVectors !== undefined ) {
    //
    // }

    // Now create the document!
    var doc = Doc( rdd, theModel.addons ); // eslint-disable-line new-cap

    // All done — cleanup document's data.
    wrappedDocData.clean();
    return doc;
  }; // readDoc()

  var learnCustomEntities = function ( examples, config ) {
    // Ensure (a) `examples` is an array and (b) and its each element is an object.
    if ( helper.isArray( examples ) ) {
      examples.forEach( ( ex ) => {
        if ( helper.isObject( ex ) ) {
          // The object must contain name  & patterns property of string and array type respectively.
          if ( ( typeof ex.name !== 'string' ) || ( ex.name === '' ) ) {
            throw Error( `wink-nlp: name should be a string, instead found "${ex.name}":\n\n${JSON.stringify( ex, null, 2 )}` );
          } else if ( helper.isArray( ex.patterns ) ) {
            for ( let k = 0; k < ex.patterns.length; k += 1 ) {
              const p = ex.patterns[ k ];
              // Each pattern should be a string.
              if ( ( typeof p !== 'string' ) || ( p === '' ) ) {
                throw Error( `wink-nlp: each pattern should be a string, instead found "${p}":\n\n${JSON.stringify( ex, null, 2 )}` );
              }
            } // for ( let k = 0;... )
          } else {
            // Pattern is not an array.
            throw Error( `wink-nlp: patterns should be an array, instead found "${typeof ex.patterns}":\n\n${JSON.stringify( ex, null, 2 )}` );
          }
          // If mark is present then it should be an array of integers **and** its length must
          // be equal to 2 **and** start index <= end index.
          if ( ( ex.mark !== undefined ) &&
                ( !helper.isIntegerArray( ex.mark ) ||
                ( ex.mark.length !== 2 ) ||
                ( ex.mark.length === 2 && ex.mark[ 0 ] > ex.mark[ 1 ] ) ) ) {
            throw Error( `wink-nlp: mark should be an array containing start & end indexes, instead found:\n\n${JSON.stringify( ex.mark, null, 2 )}` );
          }
        } else {
          // Example is not an object.
          throw Error( `wink-nlp: each example should be an object, instead found a "${typeof ex}":\n\n${JSON.stringify( ex, null, 2 )}` );
        }
      } );
    } else {
      // Examples is not an array.
      throw Error( `wink-nlp: examples should be an array, instead found "${typeof examples}".` );
    }

    // Validate config
    cerConfig = ( config === undefined || config === null ) ? Object.create( null ) : JSON.parse( JSON.stringify( config ) );
    if ( !helper.isObject( cerConfig ) ) {
      throw Error( `wink-nlp: config should be an object, instead found "${typeof cerConfig}".` );
    }
    cerConfig.matchValue = !!cerConfig.matchValue;
    cerConfig.usePOS = ( cerConfig.usePOS === undefined ) ? true : !!cerConfig.usePOS;
    cerConfig.useEntity = ( cerConfig.useEntity === undefined ) ? true : !!cerConfig.useEntity;


    // Instantiate compiler.
    compiler = Compiler( cerMetaModel, cache, tokenize, cerConfig.matchValue ); // eslint-disable-line new-cap

    cerAutomata = null;
    cerLearnings = 0;
    cerAutomata = fsm();
    const compiled = compiler.run( examples );
    cerPreserve = compiled.preserve;
    cerLearnings = cerAutomata.learn( compiled.examples );
    // cerAutomata.printModel();
    return cerLearnings;
  }; // learnCustomEntities()

  if ( helper.isObject( theModel ) ) {
    if ( typeof theModel.core !== 'function' ) {
      throw Error( 'wink-nlp: invalid model used.' );
    }
  } else {
    throw Error( 'wink-nlp: invalid model used.' );
  }

  // Build a list of valid annotations from `theModel`. This will ensure that
  // only **available** annotations from the model can be used in the pipe.
  validAnnotations.sbd = typeof theModel.sbd === 'function';
  validAnnotations.negation = typeof theModel.negation === 'function';
  validAnnotations.sentiment = typeof theModel.sa === 'function';
  validAnnotations.pos = typeof theModel.pos === 'function';
  validAnnotations.ner = typeof theModel.ner === 'function';
  validAnnotations.cer = typeof theModel.metaCER === 'function';

  const tempPipe = ( pipe === undefined ) ? Object.keys( validAnnotations ) : pipe;
  if ( helper.isArray( tempPipe ) ) {
    tempPipe.forEach( ( at ) => {
      if ( !validAnnotations[ at ] ) throw Error( `wink-nlp: invalid pipe annotation "${at}" found.` );
      currPipe[ at ] = true;
      onlyTokenization = false;
    } );
  } else throw Error( `wink-nlp: invalid pipe, it must be an array instead found a "${typeof pipe}".` );

  // Load the model.
  load();
  // Setup default configuration.
  // definePipeConfig();
  // Methods.
  methods.readDoc = readDoc;
  methods.learnCustomEntities = learnCustomEntities;
  // Expose `its` and `as` helpers.
  methods.its = itsHelpers;
  methods.as = asHelpers;

  return methods;
}; // wink

module.exports = nlp;
