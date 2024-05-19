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
/* eslint-disable no-underscore-dangle */

var recTokenizer = require( './recursive-tokenizer.js' );

/**
 * Creates an instance of tokenizer.
 *
 * @param  {object}   trex        language specific regular expressions needed for
 *                                tokenization. This includes helper, linear and
 *                                recursive.
 * @param  {object}   categories  tokens categories and their map to numeric code.
 * @param  {object}   preserve    language specific suffixes and prefixes to be preserved.
 * @return {function}             that performs the tokenization based on the
 *                                above configuration.
 * @private
 */
var tokenizer = function ( trex, categories, preserve ) {
  // Maximum number of preceding spaces allowed.
  var maxPrecedingSpaces = 65535;
  var processFunctions = [];
  var rgxCatDetectors = trex.ltc;
  var tokenizeRecursively = recTokenizer( categories, preserve );
  // Initialize helper regexes.
  var rgxAnyWithRP = trex.helpers.anyWithRP;
  var rgxAnyWithLP = trex.helpers.anyWithLP;
  var rgxLPanyRP = trex.helpers.LPanyRP;
  var rgxSplitter = trex.helpers.splitter;

  var detectTokenCategory = function ( token ) {
    // console.log( token );
    var cat;
    for ( cat = 0; cat < rgxCatDetectors.length; cat += 1 ) {
      // console.log( token, rgxCatDetectors[ cat ][ 0 ].test( token ),  rgxCatDetectors[ cat ][ 1 ] )
      if ( rgxCatDetectors[ cat ][ 0 ].test( token ) ) return rgxCatDetectors[ cat ][ 1 ];
    }
    return categories.unk;
  }; // detectTokenCategory()


  var processUnk = function ( text, cat, precedingSpaces, doc, nbsp ) {
    // Match is captured here.
    var match;
    // Splitted non-punctuation portion's category.
    var splitCat;

    // Match with any thing followed by a **right** punctuation.
    match = text.match( rgxAnyWithRP );
    // Non-null indicates that there was a right punctuation in the end.
    if ( match ) {
      // Safely add the text prior to punkt if in cache.
      splitCat = doc._addTokenIfInCache( match[ 1 ], precedingSpaces, nbsp );
      if ( splitCat === categories.unk ) {
        // Try detecting token category before falling back to recursion.
        splitCat = detectTokenCategory( match[ 1 ] );
        if ( splitCat  === categories.unk ) {
          // Still 'unk', handle it via recursive tokenizer.
          tokenizeRecursively( trex.rtc, text, precedingSpaces, doc, nbsp );
        } else {
          // Because it is a detected category use `processFunctions()`.
          processFunctions[ splitCat ]( match[ 1 ], splitCat, precedingSpaces, doc, nbsp );
          doc._addToken( match[ 2 ], categories.punctuation, 0, nbsp );
        }
      } else {
        // The split is a added via `addTokenIfInCache()`, simply add the balance.
        doc._addToken( match[ 2 ], categories.punctuation, 0, nbsp );
      }
      // All done so,
      return;
    }
    // Match with any thing followed by a **left** punctuation.
    match = text.match( rgxAnyWithLP );
    // Now non-null indicates that there was a left punctuation in the beginning.
    if ( match ) {
      // If match 2 is a valid lexeme, can safley add tokens. Notice insertion
      // sequence has reversed compared to the previous if block.
      if ( doc.isLexeme( match[ 2 ] ) ) {
        doc._addToken( match[ 1 ], categories.punctuation, precedingSpaces, nbsp );
        doc._addTokenIfInCache( match[ 2 ], 0, nbsp );
      } else {
        // Try detecting token category before falling bac k to recursion.
        splitCat = detectTokenCategory( match[ 2 ] );
        if ( splitCat  === categories.unk ) {
          // Still 'unk', handle it via recursive tokenizer.
          tokenizeRecursively( trex.rtc, text, precedingSpaces, doc, nbsp );
        } else {
          // Because it is a detected category use `processFunctions()`.
          doc._addToken( match[ 1 ], categories.punctuation, precedingSpaces, nbsp );
          processFunctions[ splitCat ]( match[ 2 ], splitCat, 0, doc, nbsp );
        }
      }
      // All done so,
      return;
    }
    // Punctuation on both sides!
    match = text.match( rgxLPanyRP );
    if ( match ) {
      // If match 2 is a valid lexeme, can safley add tokens.
      if ( doc.isLexeme( match[ 2 ] ) ) {
        doc._addToken( match[ 1 ], categories.punctuation, precedingSpaces, nbsp );
        doc._addTokenIfInCache( match[ 2 ], 0, nbsp );
        doc._addToken( match[ 3 ], categories.punctuation, 0, nbsp );
      } else {
        // Try detecting token category before falling bac k to recursion.
        splitCat = detectTokenCategory( match[ 2 ] );
        if ( splitCat  === categories.unk ) {
          // Still 'unk', handle it via recursive tokenizer.
          tokenizeRecursively( trex.rtc, text, precedingSpaces, doc, nbsp );
        } else {
          // Because it is a detected category use `processFunctions()`.
          doc._addToken( match[ 1 ], categories.punctuation, precedingSpaces, nbsp );
          processFunctions[ splitCat ]( match[ 2 ], splitCat, 0, doc, nbsp );
          doc._addToken( match[ 3 ], categories.punctuation, 0, nbsp );
        }
      }
      // All done so,
      return;
    }

    // Nothing worked, treat the whole thing as `unk` and fallback to recursive tokenizer.
    tokenizeRecursively( trex.rtc, text, precedingSpaces, doc, nbsp );
  }; // processUnk()

  // var processWord = function ( token, cat, precedingSpaces, doc ) {
  //   doc._addToken( token, cat, precedingSpaces );
  // }; // processWord()

  var processWordRP = function ( token, cat, precedingSpaces, doc, nbsp ) {
    // Handle **special case**, `^[a-z]\.$` will arrive here instead of `shortForm`!
    var tl = token.length;
    if ( tl > 2 ) {
      doc._addToken( token.slice( 0, -1 ), categories.word, precedingSpaces, nbsp );
      doc._addToken( token.slice( -1 ), categories.punctuation, 0, nbsp );
    } else if ( tl === 2 && token[ tl - 1 ] === '.' ) {
        doc._addToken( token, categories.word, precedingSpaces, nbsp );
      } else {
        doc._addToken( token.slice( 0, -1 ), categories.word, precedingSpaces, nbsp );
        doc._addToken( token.slice( -1 ), categories.punctuation, 0, nbsp );
      }
  }; // processWordRP()

  var processDefault = function ( token, cat, precedingSpaces, doc, nbsp ) {
    doc._addToken( token, cat, precedingSpaces, nbsp );
  }; // processDefault()

  var tokenize = function ( doc, text ) {
    // Raw tokens, obtained by splitting them on spaces.
    var rawTokens = [];
    // Contains the number of spaces preceding a token.
    var precedingSpaces = 0;
    // Non breaking spaces.
    var nbSpaces = null;
    // Pointer to the `rawTokens`, whereas `pp` is the previous pointer!
    var p;
    // Token category as detected by the `detectTokenCategory()` function.
    var cat;
    // A temporary token!
    var t;

    rawTokens = text.split( rgxSplitter );

    // Now process each raw token.
    for ( p = 0; p < rawTokens.length; p += 1 ) {
      t = rawTokens[ p ];
      // Skip empty (`''`) token.
      if ( !t ) continue; // eslint-disable-line no-continue
      // Non-empty token:
      const hasNBSP = ( /[\u00a0\u2002-\u2005\u2009\u200a\u202f\u205f]/ ).test( t );
      if ( t[ 0 ] === ' ' || hasNBSP ) {
        // This indicates spaces: count them.
        precedingSpaces = t.length;
        if ( hasNBSP ) {
          nbSpaces = t;
          precedingSpaces = maxPrecedingSpaces;
        } else if ( precedingSpaces > maxPrecedingSpaces - 1 ) precedingSpaces = maxPrecedingSpaces - 1;
        // Cap precedingSpaces to a limit if it exceeds it.
        // if ( precedingSpaces > maxPrecedingSpaces - 1 ) precedingSpaces = maxPrecedingSpaces - 1;
      } else {
        // A potential token: process it.
        cat = doc._addTokenIfInCache( t, precedingSpaces, nbSpaces );
        if ( cat === categories.unk ) {
          cat = detectTokenCategory( t );
          processFunctions[ cat ]( t, cat, precedingSpaces, doc, nbSpaces );
        }
        precedingSpaces = 0;
        nbSpaces = null;
      }
    } // for
  }; // tokenize()

  // Main Code:
  // Specific Processes.
  processFunctions[ categories.unk ] = processUnk;
  processFunctions[ categories.wordRP ] = processWordRP;

  // Default process.
  processFunctions[ categories.emoji ] = processDefault;
  processFunctions[ categories.word ] = processDefault;
  processFunctions[ categories.shortForm ] = processDefault;
  processFunctions[ categories.number ] = processDefault;
  processFunctions[ categories.url ] = processDefault;
  processFunctions[ categories.email ] = processDefault;
  processFunctions[ categories.mention ] = processDefault;
  processFunctions[ categories.hashtag ] = processDefault;
  processFunctions[ categories.emoticon ] = processDefault;
  processFunctions[ categories.time ] = processDefault;
  processFunctions[ categories.ordinal ] = processDefault;
  processFunctions[ categories.currency ] = processDefault;
  processFunctions[ categories.punctuation ] = processDefault;
  processFunctions[ categories.symbol ] = processDefault;
  processFunctions[ categories.tabCRLF ] = processDefault;
  processFunctions[ categories.apos ] = processDefault;
  processFunctions[ categories.alpha ] = processDefault;
  processFunctions[ categories.decade ] = processDefault;

  return tokenize;
}; // tokenizer()

module.exports = tokenizer;
