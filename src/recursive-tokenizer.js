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

/* eslint-disable no-underscore-dangle */

// Used in accessing the regex and its category from `rgxs`.
const RGX = 0;
const CAT = 1;
// SPECIAL REGULAR EXPRESSIONS:
// Regex to handle short forms or abbreviations.
var rgxShortFormDot = /^(?:(?:[A-Z])(?:\.))+$/i;
var rgxShortForm = /^(?:(?:[A-Z])(?:\.))+[a-z]?$/i;
// Regex process hyphenated words.
var rgxHyphens = /[\-\–\—]/gi;
var rgxPeriod = /[\.]/gi;
var rgxNumber = /[0-9]/;

// ### tokenizer
/**
 *
 * Creates an instance of `tokenizer`.
 *
 * @param {object} categories token categories, as obtained via the language model.
 * @param {object} preserve rules for hyphenation preservation.
 * @return {function} for recursive tokenization.
 * @private
*/
var tokenizer = function ( categories, preserve ) {
  // Function to add tokens to the `doc()`.
  var addToken;
  var addTokenIfInCache;
  // Function to test if lexeme exists via `doc()`.
  var isLexeme;
  // Preceding Spaces — special need for recursive tokenizer.
  var ps = 0;

  // ### pushHyphenatedToken
  /**
   *
   * Pushes the incoming `tkn` after handling hyphens, if any:
   * 1. Use it as-is if it is a valid lexeme or contains a number.
   * 2. Use it as-is if does not contain hyphens.
   * 3. Otherwise apply rules.
   *
   * @param {string} tkn to be processed as per rules hyphenation rules in `preserve`.
   * @param {array} tokens into which the (split) `tkn` is pushed.
   * @returns {void} nothing!
   * @private
  */
  var pushHyphenatedToken = function ( tkn, tokens ) {
    // Will contain pure alpha words, obtained by splitting on `rgxHyphens`.
    var words;
    // Will contain mathed hyphens.
    var hyphens;
    // Helper variables.
    var i, k, last;

    // If a token is a valid lexeme or contains one or more number, dont touch it.
    if ( isLexeme( tkn) || rgxNumber.test( tkn ) ) {
      tokens.push( [ tkn, categories.word ] );
      return;
    }

    hyphens = tkn.match( rgxHyphens );
    // If there are no hyphens in the word, dont touch it.
    if ( hyphens === null ) {
      tokens.push( [ tkn, categories.word ] );
      return;
    }

    // Word is hyphenated, process it according to the rules specified in `preserve`.
    words = tkn.split( rgxHyphens );
    last = words.length - 1;
    if ( preserve.prefix[ words[ 0 ] ] || preserve.suffix[ words[ last ] ] ) {
      tokens.push( [ tkn, categories.word ] );
      return;
    }
    k = 0;
    for ( i = 0; i < words.length; i += 1 ) {
      // Do not push any empty token!
      if ( words[ i ] !== '' ) {
        tokens.push( [ words[ i ], categories.word ] );
      }

      if ( k < hyphens.length ) {
        tokens.push( [ hyphens[ k ], categories.punctuation ] );
      }
      k += 1;
    }
  }; // pushHyphenatedToken()

  // ### pushWordToken
  /**
   *
   * Pushes the incoming `tkn` after handling periods and hyphens present:
   * 1. Use it as-is if it is a valid lexeme or a short form ending with a period.
   * 2. Split on period and the successively assemble tokens using matches & splits.
   * 3. Finally send each such assembled token down for handling hyphenated word.
   *
   * @param {string} tkn to be processed and pushed.
   * @param {array} tokens into which the (split) `tkn` is pushed.
   * @returns {void} nothing!
   * @private
  */
  var pushWordToken = function ( tkn, tokens ) {
    // Will contain words, obtained by splitting on `rgxPeriod`.
    var words;
    // Will contain matched periods.
    var periods;
    // Helper variables:<br/>
    // Index variables
    var i, k;
    // Used in successively assembling a potential token from matches & words
    // (i.e. splits), if word has periods.
    var currBuild = '';
    var nextBuild = '';


    // If a token is a **valid lexeme**, or it is **short form ending with a
    // period** (e.g. dot) then _dont touch it._
    if ( isLexeme( tkn ) || rgxShortFormDot.test( tkn ) ) {
      tokens.push( [ tkn, categories.word ] );
      return;
    }

    // Start by matching with periods
    periods = tkn.match( rgxPeriod );
    // If there are no periods in the word, dont touch it.
    if ( periods === null ) {
      pushHyphenatedToken( tkn, tokens );
      return;
    }

    // Word has periods, therefore process it:
    words = tkn.split( rgxPeriod );
    k = 0;

    for ( i = 0; i < words.length; i += 1 ) {
      // Build next potential token by joining the current build with the next word.
      nextBuild = currBuild + words[ i ];
      // If it is a valid possibility, then continue building it.
      if ( rgxShortForm.test( nextBuild ) || ( isLexeme( nextBuild ) && nextBuild.length > 2 ) || ( currBuild === '' ) ) {
        currBuild = nextBuild;
      } else {
        // Else send it down to handle hyphenated word.
        pushHyphenatedToken( currBuild, tokens );
        // Reset builds.
        currBuild = words[ i ];
        nextBuild = '';
      }

      if ( k < periods.length ) {
        // In the same manner handle period sign.
        nextBuild = currBuild + periods[ k ];
        if ( rgxShortForm.test( nextBuild ) || ( isLexeme( nextBuild ) && nextBuild.length > 2 ) ) {
          currBuild = nextBuild;
        } else {
          pushHyphenatedToken( currBuild, tokens );
          tokens.push( [ periods[ k ], categories.punctuation ] );
          currBuild = '';
          nextBuild = '';
        }
      }
      k += 1;
    }
    // Handle the last piece if applicable.
    if ( currBuild !== '' ) pushHyphenatedToken( currBuild, tokens );
  }; // pushWordToken()

  // ### tokenizeTextUnit
  /**
   *
   * Attempts to tokenize the input `text` using the `rgxSplit`. The tokenization
   * is carried out by combining the regex matches and splits in the right sequence.
   * The matches are the *real tokens*, whereas splits are text units that are
   * tokenized in later rounds! The real tokens (i.e. matches) are pushed as
   * `object` and splits as `string`.
   *
   * @param {string} text unit that is to be tokenized.
   * @param {object} rgxSplit object containing the regex and it's category.
   * @return {array} of tokens.
   * @private
  */
  var tokenizeTextUnit = function ( text, rgxSplit ) {
    // Regex matches go here; note each match is a token and has the same tag
    // as of regex's category.
    var matches = text.match( rgxSplit[ RGX ] );
    // Balance is "what needs to be tokenized".
    var balance = text.split( rgxSplit[ RGX ] );
    // The result, in form of combination of tokens & matches, is captured here.
    var tokens = [];
    // The tag;
    var tag = rgxSplit[ CAT ];
    // Helper variables.
    var i,
        imax,
        k,
        t; // Temp token.
        // tp; // Temp token with a period sign in end.

    // console.log( matches, balance, text, tag, balance[ 1 ] ); // eslint-disable-line no-console
    // A `null` value means it is equivalent to no matches i.e. an empty array.
    matches = ( matches ) ? matches : [];
    // Handle cases where the word is ending with period for **word category**.
    // Iterate in [ m0 b1 m1 ... ] pattern as `b0` has no value here.
    // *** COMMENTED out after `pushWordToken()`:
    // k = 0;
    // if ( tag === categories.word ) {
    //   for ( i = 1, imax = balance.length; i < imax; i += 1 ) {
    //     t = balance[ i ];
    //     if ( k < matches.length && t[ 0 ] === '.' ) {
    //       tp = matches[ k ] + '.';
    //       if ( isLexeme( tp ) || rgxShortForm.test( tp ) ) {
    //         matches[ k ] = tp;
    //         balance[ i ] = t.slice( 1 );
    //       }
    //     }
    //     k += 1;
    //   }
    // }

    // console.log( matches, balance, text, tag, balance[ 1 ] ); // eslint-disable-line no-console
    // Combine tokens & matches in the following pattern [ b0 m0 b1 m1 ... ]
    k = 0;
    for ( i = 0, imax = balance.length; i < imax; i += 1 ) {
      t = balance[ i ];
      t = t.trim();
      if ( t ) tokens.push( t );
      if ( k < matches.length ) {
        if ( tag === categories.word ) {
          // Handle special cases for words via:
          pushWordToken( matches[ k ], tokens );
        } else {
          tokens.push( [ matches[ k ], tag ] );
        }
      }
      k += 1;
    }

    return ( tokens );
  }; // tokenizeTextUnit()

  // ### tokenizeTextRecursively
  /**
   *
   * Tokenizes the input text recursively using the array of `regexes` and then
   * the `tokenizeTextUnit()` function. If (or whenever) the `regexes` becomes
   * empty, it simply splits the text on non-word characters instead of using
   * the `tokenizeTextUnit()` function.
   *
   * @param {string} text unit that is to be tokenized.
   * @param {object} regexes object containing the regex and it's category.
   * @return {undefined} nothing!
   * @private
  */
  var tokenizeTextRecursively = function ( text, regexes ) {
    var sentence = text.trim();
    var tokens = [];
    // Helpers – for loop variables & token category.
    var i, imax;
    var cat;

    if ( !regexes.length ) {
      // No regex left, this is the true **unk**.
      // Becuase it is `UNK`, we can use `addToken` instead of attempting
      // `addTokenIfInCache`.
      addToken( text, categories.unk, ps );
      ps = 0;
      return;
    }

    var rgx = regexes[ 0 ];
    tokens = tokenizeTextUnit( sentence, rgx );

    for ( i = 0, imax = tokens.length; i < imax; i += 1 ) {
      if ( typeof tokens[ i ] === 'string' ) {
        // Strings become candidates for further tokenization.
        tokenizeTextRecursively( tokens[ i ], regexes.slice( 1 ) );
      } else {
        // Use the passed value of preceding spaces only once!
        // First try cache, otherwise make a direct addition. This ensures
        // processing of expansions.
        cat = addTokenIfInCache( tokens[ i ][ 0 ], ps );
        if ( cat === categories.unk ) addToken( tokens[ i ][ 0 ], tokens[ i ][ 1 ], ps );
        // Reset `ps` to **0** as there can never be spaces in a text passed to
        // this tokenizer.
        ps = 0;
      }
    }
  }; // tokenizeTextRecursively()

  // ### tokenize
  /**
   *
   * Tokenizes the input `sentence` using the function `tokenizeTextRecursively()`.
   * This acts as the fall back tokenizer to the **linear tokenizer**.
   *
   * @method Tokenizer#tokenize
   * @param {RegExp} rgxs containg regexes for parsing.
   * @param {string} text the input sentence.
   * @param {number} precedingSpaces to the text
   * @param {object} doc contains the document; used here for adding tokens.
   * @return {void} nothing!
   * `value` and its `tag` identifying the type of the token.
   * @private
  */
  var tokenize = function ( rgxs, text, precedingSpaces, doc ) {
    // Cache frequently used doc methods.
    addToken = doc._addToken;
    addTokenIfInCache = doc._addTokenIfInCache;
    isLexeme = doc.isLexeme;
    // Set `ps` to the passed value of preceding spaces, it will be reset to **0**
    // after first use during recursion.
    ps = precedingSpaces;
    tokenizeTextRecursively( text, rgxs, precedingSpaces );
  }; // tokenize()

  return tokenize;
};

module.exports = tokenizer;
