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
var Automata = require( './automaton.js' );
var mappers = require( './tokens-mappers.js' );
var mapRawTokens2UIdOfValue = mappers.mapRawTokens2UIdOfValue;
var mapRawTokens2UIdOfNormal = mappers.mapRawTokens2UIdOfNormal;

var cerAutomata = Automata(); // eslint-disable-line new-cap

var rgxOr = /^\[((?:[^| ]+\|)+?|(?:\|[^| ]+)+?|(?:[^| ]+\|[^| ]+)+?|(?:[^| ]+))\]$/;
var rgxPipe = /\|/g;

// ## mergeSplitsAndMatches
/**
 * Helper function to merge the two input array elements by picking elements
 * alternatively from each array.
 * @param  {string[]} splts obtained by splitting on pipe.
 * @param  {string[]} mtchs obtained by matching on pipe.
 * @return {string[]}       the merged array.
 * @private
 */
var mergeSplitsAndMatches = function ( splts, mtchs ) {
  const [ s0, ...splits ] = splts;
  return ( ( s0 === undefined ) ? mtchs : [ s0, ...mergeSplitsAndMatches( mtchs, splits ) ] );
}; // mergeSplitsAndMatches()

// # compiler
/**
 * It transforms the input patterns for custom entity recognition into a model,
 * which is run by winkNLP's `readDoc()` method. The model is created by
 * the `learnCustomEntities()` method of core winkNLP using this compiler. Brefore
 * the compiler can be **run**, its instance must be created using the following
 * parameters:
 *
 * @param  {JSON}     cerModel    precompiled custom entity meta model — handles escaping
 *                                of entity literals. For example `^ADJ` will match
 *                                with token `ADJ` (or `adj` based on `matchValue` in
 *                                `cerConfig`), whereas `ADJ` will match with the
 *                                adjective part-of-speech of a token.
 * @param  {object}   cache       of lexicon, which is required to deliver performance.
 * @param  {function} tokenize    is instantiated from core tokenizer, which tokenises the
 *                                input patterns. It is used in the `tokenizeText()` private
 *                                method of compiler.
 * @param  {boolean}  matchValue  match value flag — defines match on either `value` or
 *                                `normal` of tokens.<br/>
 * @return {object}               contains **run** function, which can compile the input
 *                                pattern into a model.
 * @private
 */
var compiler = function ( cerModel, cache, tokenize, matchValue ) {
  // Returned!
  var methods = Object.create( null );
  // Map of literals to be preserved.
  var preserve;

  cerAutomata.importJSON( cerModel );
  // On pattern detection, we need to save the custom property — `preserve`
  // created by the `cerModel's` execution.
  cerAutomata.setOnPatternDetectionFn( ( match, customProperty ) => ( match.push( customProperty ) ) );

  // ## hasOrPattern
  /**
   * Test the presence of or-pattern in the tokens and returns the index of the
   * same.
   * @param  {string[]} tokens of each word, split on spaces.
   * @return {number}          the index where token is found otherwise -1.
   * @private
   */
  var hasOrPattern = function ( tokens ) {
    // Use findIndex with regex to locate.
    return ( tokens.findIndex( ( e ) => rgxOr.test( e ) ) !== -1 );
  }; // hasOrPattern()

  // ## encloseInSquareBracket
  /**
   * Heper function to enclose incoming text element within square brackets.
   * @param  {string} e input text element.
   * @return {string}   enclosed text element.
   * @private
   */
  var encloseInSquareBracket = function ( e ) {
    // Enclose!
    return '[' + e +  ']';
  }; // encloseInSquareBracket()

  // ## tokenizeText
  /**
   * Tokenizes the incoming text using wink-nlp's tokenizer.
   * @param  {string} text   input text string.
   * @return {object[]}      where each object contains normal & value of the token.
   * @private
   */
  var tokenizeText = function ( text ) {
    // Mimic wink-nlp like manoeuvre!
    var rdd = Object.create( null );
    rdd.cache = cache;
    rdd.tokens = [];
    var wrappedDocData = DocDataWrapper( rdd );  // eslint-disable-line new-cap

    tokenize( wrappedDocData, text ); // eslint-disable-line new-cap
    const tokens = [];
    const values = mapRawTokens2UIdOfValue( rdd ).map( ( t ) => cache.value( t ) );
    const normals = mapRawTokens2UIdOfNormal( rdd ).map( ( t ) => cache.value( t ) );
    for ( let i = 0; i < values.length; i += 1 ) tokens.push( { value: values[ i ], normal: normals[ i ] } );
    return tokens;
  }; // tokenizeText()

  // ## compileSimplePattern
  /**
   * Compiles a simple pattern.
   *
   * @param  {string} text    input simple pattern string.
   * @return {string[]}       of compiled pattern.
   * @private
   */
  var compileSimplePattern = function ( text ) {
    // Compiled pattern build here.
    const cp = [];
    // Tokenized `text`.
    const tokens = tokenizeText( text );
    // Spans of recognized patterns from tokens' value because patterns are always
    // in UPPER case.
    const spans = cerAutomata.recognize( tokens.map( ( t ) => t.value ) );
    // The spans are mapped into `replacements` and are indexed by `spans[ i ][ 0 ]`.
    // `e[ 0 ]` & e[ 1 ] are start & end indexes, `e[ 2 ]` is entity name, and
    // `e[ 3 ]` is customProperty, where true mean preserve replacement.
    const replacements = Object.create( null );
    spans.forEach( ( e ) => ( replacements[ e[ 0 ] ] = [ e[ 1 ], e[ 2 ], e[ 3 ] ] ) );
    // Perform replacements.
    for ( let i = 0; i < tokens.length; i += 1 ) {
      // Replacement defined for this index — `i`? **Yes** means it could be a property
      // or esacped property or a lone escape character or an esacped escape character. **No**
      // means a literal.
      if ( replacements[ i ] ) {
        // **Empty** entity name indicates a lone escape character.
        if ( replacements[ i ][ 1 ] !==  '' ) {
          // Preserve? **Yes** means it is an escaped property or escape char;
          // **No** means property.
          if ( replacements[ i ][ 2 ].preserve ) {
            // Since it has to be preserved, `matchValue` drives both the `cp` &
            // `preserve` contents i.e. **normal** or **value**

            // This contains escaped `<property>`.
            const tri0 = ( matchValue ) ? tokens[ replacements[ i ][ 0 ] ].value : tokens[ replacements[ i ][ 0 ] ].normal;
            // This conntains `<property>&`.
            const ri1 = ( matchValue ) ? replacements[ i ][ 1 ] : replacements[ i ][ 1 ].toLowerCase();
            // Map escaped `<property>` to `<property>&`.
            preserve[ tri0 ] = ri1;
            cp.push( ri1 );
          } else {
            // It is a **property**, therefore it has to go to the state machine
            // **as-is**.
            cp.push( replacements[ i ][ 1 ] );
          }
        }
        // Skip by moving `i` to the end index.
        i = replacements[ i ][ 0 ];
      } else {
        // **Literal**: Extract token's normal or value based on `matchValue` flag.
        const ti = ( matchValue ) ? tokens[ i ].value : tokens[ i ].normal;
        cp.push( ti );
        preserve[ ti ] = ti;
      }
    }
    // Return compiled pattern.
    return cp;
  }; // compileSimplePattern()

  // ## compileOrPattern
  /**
   * Compiles the tokens containing "or" patterns.
   * @param  {string[]} tokens  contains the incoming tokens.
   * @return {string}           compiled text string.
   * @private
   */
  var compileOrPattern = function ( tokens ) {
    const pattern = [];
    for ( let i = 0; i < tokens.length; i += 1 ) {
      if ( rgxOr.test( tokens[ i ] ) ) {
        // Strip the opening/closing square brackets.
        const ti = tokens[ i ].substring( 1, tokens[ i ].length - 1 );
        // Find matches with `rgxPipe`; if they are null set to an empty array.
        const matches = ti.match( rgxPipe ) || [];
        // Find splits on `rgxPipe`.
        const splits = ti.split( rgxPipe );
        // Iterate through `splits` to check that each element cannot be tokenized
        // further.
        for ( let j = 0; j < splits.length; j += 1 ) {
          const st = ( splits[ j ] === '' ) ? [ '' ] : compileSimplePattern( splits[ j ] );
          if ( st.length > 1 ) {
           throw Error( `wink-nlp: incorrect token "${st.join( '' )}" encountered in examples of learnCustomEntities() API.` );
          }
          splits[ j ] = st[ 0 ];
        } // splits iterations
        // Merge matches & splits to create the pattern.
        pattern.push( encloseInSquareBracket( mergeSplitsAndMatches( splits, matches ).join( '' ) ) );
      } else {
        // Simple part of text, just enclose it in square brackets after replacement (if any).
        compileSimplePattern( tokens[ i ] ).forEach( ( t ) => pattern.push( encloseInSquareBracket( t ) ) );
      }
    }
    return pattern.join( ' ' );
  }; // compileOrPattern()

  // ## compileSinglePattern
  /**
   * Compiles a single pattern text. It invokes compilation of "or" or "simple"
   * pattern based on input text type.
   *
   * @param  {string} text      input pattern text.
   * @return {(array|string)}   depending onn type of pattern.
   * @private
   */
  var compileSinglePattern = function ( text ) {
    // Split on spaces.
    const atoms = text.trim().split( /\s+/ );
    // Invoke required compilation based on the type of `atoms` i.e. the text.
    if ( hasOrPattern( atoms ) ) {
      return compileOrPattern( atoms );
    }
    return compileSimplePattern( text );
  }; // compileSinglePattern()

  // ## run
  /**
   * Runs the compiler to compile the examples. It calls `compileSinglePattern()`
   * on each example iteratively.
   *
   * @param  {object[]} examples containing objects, where each object defines an
   *                             entity in terms of name and pattern.
   * @return {object}            compiled examples ready for automata and literals
   *                             preserve.
   * @private
   */
  var run = function ( examples ) {
    // Compiled examples are captured here.
    const ces = [];
    // Intialize preserve every time a new compilation happens.
    preserve = Object.create( null );
    for ( let i = 0; i < examples.length; i += 1 ) {
      const example = examples[ i ];
      const patterns = example.patterns;
      for ( let j = 0; j < patterns.length; j += 1 ) {
        const cp = compileSinglePattern( patterns[ j ] );
        const ce = Object.create( null );
        ce.name = example.name;
        ce.pattern = cp;
        if ( example.mark ) ce.mark = example.mark;
        ces.push( ce );
      }
    }

    return { examples: ces, preserve: preserve };
  }; // run()

  methods.run = run;

  return methods;
}; // compiler()

module.exports = compiler;
