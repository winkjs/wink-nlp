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

var regex = /\[.*?\]/g;

// ## extractEnclosedText
/**
 *
 * Extracts the text enclosed in square brackets.
 *
 * @param {string} text from which enclosed text is extracted.
 * @returns {string[]} texts enclosed within square brackets.
 * @private
*/
var extractEnclosedText = function ( text ) {
  var // Extracted elements are captured here.
      elements = [],
      // Extract matches with quotes
      matches = text.match( regex );
  if ( !matches || ( matches.length === 0 ) ) return null;
  // Collect elements after removing the quotes.
  for ( var k = 0, kmax = matches.length; k < kmax; k += 1 ) {
    elements.push( matches[ k ].substr( 1, matches[ k ].length - 2 ) );
  }
  return ( elements );
}; // extractEnclosedText();

// ## productReducer
/**
 *
 * Callback function used by `reduce` inside the `product()` function.
 * Follows the standard guidelines of `reduce()` callback function.
 *
 * @param {array} prev refer to JS reduce function.
 * @param {array} curr refer to JS reduce function.
 * @returns {array} reduced value.
 * @private
*/
var productReducer = function ( prev, curr ) {
  var c,
      cmax = curr.length;
  var p,
      pmax = prev.length;
  var result = [];

  for ( p = 0; p < pmax; p += 1 ) {
    for ( c = 0; c < cmax; c += 1 ) {
      result.push( prev[ p ].concat( curr[ c ] ) );
    }
  }
  return ( result );
}; // productReducer()

/**
 *
 * Finds the Cartesian Product of arrays present inside the array `a`. Therefore
 * the array `a` must be an array of 1-dimensional arrays. For example,
 * `product( [ [ 9, 8 ], [ 1, 2 ] ] )` will produce
 * `[ [ 9, 1 ], [ 9, 2 ], [ 8, 1 ], [ 8, 2 ] ]`.
 *
 * @param {array} a whose cartesian product is computed.
 * @returns {array} reduced value.
 * @private
*/
var product = function ( a ) {
  return (
    a.reduce( productReducer, [ [] ] )
  );
}; // product()


// ## composeCorpus
/**
 *
 * Generates all possible patterns from the input argument string.
 * The string s must follow a special syntax as illustrated in the
 * example below:<br/>
 * `'[I] [am having|have] [a] [problem|question]'`<br/>
 *
 * Each phrase must be quoted between `[ ]` and each possible option of phrases
 * (if any) must be separated by a `|` character. The patterns are composed by
 * computing the cartesian product of all the phrases.
 *
 * If a single patterns expands to a large size then it issues console
 * warning/error at 512/65536 level.
 *
 * @param {string} str the input string.
 * @return {string[]} of all possible patterns.
 * @private
*/
var composePatterns = function ( str ) {
  if ( !str || ( typeof str !== 'string' ) ) return [];

  const LIMIT1 = 512;
  const LIMIT2 = 65536;
  var quotedTextElems = extractEnclosedText( str );
  var patterns = [];
  var finalPatterns = [];

  if ( !quotedTextElems ) return [ [ str ] ];
  quotedTextElems.forEach( function ( e ) {
    patterns.push( e.split( '|' ) );
  } );

  // Compute the size of the array that will be produced as a result of processing
  // the pattern.
  const size = patterns.reduce( ( ( prev, curr ) => prev * curr.length ), 1 );

  // Issue warning/error if the size is prohibitively large from the end-user
  // prespective. Note: while winkNLP can handle even larger sizes, it can
  // still break down in the event of explosion!
  if ( size > LIMIT1 && size < LIMIT2 ) {
    console.warn( 'winkNLP: complex pattern detected, consider simplifying it!' );
  } else if ( size > LIMIT2 ) console.error(
                              'winkNLP: very complex pattern detected, please review and simplify.\n' +
                              '         === It may slow down further execution! ===\n\n'
                             );

  product( patterns ).forEach( function ( e ) {
    finalPatterns.push( e.join( ' ' ).trim().split( /\s+/ ) );
  } );
  return ( finalPatterns );
}; // composePatterns()

module.exports = composePatterns;
