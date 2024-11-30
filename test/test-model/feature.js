//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp language models”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions =
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

var tcat = require( './token-categories.js' );

// Setup token category to pos map.
var tcat2pos = new Array( tcat.list.length );
tcat2pos.fill( 0 );
tcat2pos[ 0 ] = 17;   // unk/x
tcat2pos[ 2 ] = 9;    // number/num
tcat2pos[ 3 ] = 15;   // url/sym
tcat2pos[ 4 ] = 15;   // email/sym
tcat2pos[ 4 ] = 15;   // url/sym
tcat2pos[ 5 ] = 12;   // mention/propn
tcat2pos[ 6 ] = 15;   // hashtag/sym
tcat2pos[ 7 ] = 15;   // emoji/sym
tcat2pos[ 8 ] = 15;   // emoticon/sym
tcat2pos[ 9 ] = 15;   // time/sym
tcat2pos[ 10 ] = 11;  // ordinal/adj
tcat2pos[ 11 ] = 15;  // currency/sym
tcat2pos[ 12 ] = 13;  // punctuation/punct
tcat2pos[ 13 ] = 15;  // symbol/sym
tcat2pos[ 14 ] = 14;  // tabcrlf/space
tcat2pos[ 18 ] = 9;   // decade/num

var suffix2pos = Object.create( null );
suffix2pos.ing = 16;    // verb
suffix2pos.ed = 16;     // verb
suffix2pos.ly = 3;      // adv
suffix2pos.able = 1;    // adj
suffix2pos.tish = 1;    // adj
suffix2pos.like = 1;    // adj
suffix2pos.ous = 1;     // adj
suffix2pos.ful = 1;     // adj
suffix2pos.ary = 1;     // adj
suffix2pos.less = 1;    // adj
suffix2pos.ier = 1;     // adj
suffix2pos.est = 1;     // adj
suffix2pos.fy = 1;     // adj
suffix2pos.ky = 1;     // adj
suffix2pos.es = 8;     // noun
suffix2pos.er = 8;     // noun
suffix2pos.or = 8;     // noun
suffix2pos.ity = 8;     // noun
suffix2pos.ion = 8;     // noun
suffix2pos.llah = 12;     // propn
suffix2pos.stan = 12;     // propn
suffix2pos.gton = 12;     // propn
suffix2pos.abad = 12;     // propn
suffix2pos.land = 12;     // propn
suffix2pos.pur = 12;     // propn
suffix2pos.tnam = 12;     // propn


var prefix2pos = Object.create( null );
// prefix2pos.un = 1;      // adj
// prefix2pos.pro = 1;     // adj
prefix2pos.anti = 1;    // adj
prefix2pos.post = 1;    // adj
prefix2pos.non = 1;     // adj
// prefix2pos.mid = 8;     // noun
prefix2pos.cross = 8;   // noun
// prefix2pos.re = 16;     // verb


var feature = function ( config, lang, featuresData, isLexicographer ) {
  const rgxLC = /^[a-z][a-z\-\–\—\.]*$/;
  const rgxUC = /^[A-Z][A-Z\-\–\—\.]*$/;
  const rgxTC = /^[A-Z][a-z\-\–\—\.]*$/;
  var rgxDiacriticalWordJoiner = /[\u0300-\u036f\u2060]/g;

  // The Regex, Category  pair goes in to this array for category detection &
  // assignment.
  var rgxCatDetectors = [];
  // Extract the regexes required for lexicographer. Note, `lang` & `featuresData`
  // can be `undefined` or `null` when called from wink-nlp.
  var regexes = ( lang ) ? lang.trex.lex : null;
  // Helpers for regex management.
  var imax = ( lang ) ? regexes.length : 0;
  var i;
  // Features data used for pos & lemma.
  const fd = featuresData;
  // Returned!
  var methods = Object.create( null );

  var shape = function ( word ) {
    return (
      word
      .normalize( 'NFD' ).replace( rgxDiacriticalWordJoiner, '' )
        .replace( /[A-Z]{4,}/g, 'XXXX' )
        // Handle <4 Caps
        .replace( /[A-Z]/g, 'X' )
        // Same logic for small case.
        .replace( /[a-z]{4,}/g, 'xxxx' )
        .replace( /[a-z]/g, 'x' )
        // and for digits.
        .replace( /\d{4,}/g, 'dddd' )
        .replace( /\d/g, 'd' )
    );
  }; // shape()

  var lutCase = function ( word ) {
    if ( rgxLC.test( word ) ) return 1;
    if ( rgxUC.test( word ) ) return 2;
    if ( rgxTC.test( word ) ) return 3;
    return 0;
  }; // lutCase()

  var suffix = function ( word ) {
    return word.slice( -config.suffix );
  }; // suffix()

  var prefix = function ( word ) {
    return word.slice( 0, config.prefix );
  }; // suffix()

  var lexeme = function ( word ) {
    return word;
  }; // lexeme()

  var lexemeCID = function ( word ) {
    return word;
  }; // lexemeCID()

  var oovPoS = function ( word ) {
    // If not in lower case, declare proper noun.
    if ( !rgxLC.test( word ) ) return 12;
    var wlc = word.toLowerCase();
    var pos = suffix2pos[ wlc.slice( -4 ) ] ||
                suffix2pos[ wlc.slice( -3 ) ] ||
                suffix2pos[ wlc.slice( -2 ) ] ||
                prefix2pos[ wlc.slice( 0, 5 ) ] ||
                prefix2pos[ wlc.slice( 0, 4 ) ] ||
                prefix2pos[ wlc.slice( 0, 3 ) ] ||
                prefix2pos[ wlc.slice( 0, 2 ) ];

    // Fall back to noun if undefined.
    return pos || 8;
  };

  var partOfSpeech = function ( word, category, cache ) {
    if ( isLexicographer ) {
      // Get the array of pos tags.
      const tags = fd.pos.hash[ word ];
      if ( !tags ) return lang.xpos.hash.UNK;
      // Return the pos tag's index, if it is unique otherwise `UNK`!
      return  lang.xpos.hash[ ( tags && tags.length === 1 ) ? tags[ 0 ] : 'UNK' ];
    }
    // OOV, try determining the pos tag here.
    var pos;
    var wordInLC;
    if ( category === tcat.hash.word ) {
      // Check if the lower case of the word is present in lexicon
      wordInLC = word.toLowerCase();
      const hash = cache.lookup( wordInLC )[ 0 ];
      if ( hash < cache.intrinsicSize() ) {
        // Lowercased word is found in the vocabulary; this also implies that
        // the `word` was NOT in lowercase. Therefore, it may be a candidate PROPN.
        // Now, extract pos of lower cased word.
        const posOfWLC = cache.posOf( hash );
        // If the lowercased word is NOUN or ADJ then switch to PROPN.
        pos = ( posOfWLC === 8 || posOfWLC === 1 ) ? 12 : posOfWLC;
      } else {
        pos = oovPoS( word );
        // Word but completely missing from lexicon: if it is word-like then
        // assign PROPN, mixed case then also PROPN else NOUN.
        // pos = ( ( /^[a-z]*$/i ).test( word ) ) ?
        //         ( ( ( /^[a-z]*$/ ).test( word ) ) ? 8 : 12 ) : 12;
      }
    }
    // If pos is not found, try obtaining pos from tact2pos map else NOUN.
    return pos || tcat2pos[ category ] || ( ( rgxTC.test( word ) ) ? 12 : 8 );
  }; // partOfSpeech()

  var isSPoS = function ( word ) {
    // Get the array of pos tags.
    const tags = fd.pos.hash[ word ];
    return  ( tags && tags.length === 1 ) ? 1 : 0;
  }; // isSPoS()

  var lemma = function ( word ) {
    // For OOV word, always return 0;
    if ( fd.lexeme.hash[ word ] === 0 ) return 0;
    // Lemmas array for word.
    const lmh = fd.lemma.hash[ word ];
    // Print error if `lemma` is missing from lexicon!
    if ( lmh === undefined || fd.lexeme.hash[ lmh[ 0 ] ] === undefined ) {
      // `\x1b[41m` highlights in red & `\x1b[0m` resets the display.
      console.log( '\x1b[41m%s\x1b[0m entry is missing! (feature.lemma)', JSON.stringify( lmh[ 0 ] ) ); // eslint-disable-line no-console
      return 0;
    }
    return fd.lexeme.hash[ lmh[ 0 ] ];
  }; // lemma()

  var isSLemma = function ( word ) {
    // For OOV word, always return false;
    if ( fd.lexeme.hash[ word ] === 0 ) return 0;
    // Lemmas array for word.
    const lmh = fd.lemma.hash[ word ];
    return ( lmh && fd.lexeme.hash[ lmh[ 0 ] ] && lmh.length === 1 ) ? 1 : 0;
  }; // isSLemma()

  var isAbbrev = function ( word ) {
    return ( /[a-z].*\.$/i ).test( word ) ? 1 : 0;
  }; // isAbbrev()

  var normal = function ( word ) {
    // Hash of lowercased word.
    const lcwHash = fd.lexeme.hash[ word.toLowerCase() ];
    // Print error if `word.lowercase` is missing from lexicon!
    if ( lcwHash === undefined ) {
      // `\x1b[41m` highlights in red & `\x1b[0m` resets the display.
      console.log( '\x1b[41m%s\x1b[0m entry is missing! (feature.normal)', JSON.stringify( word.toLowerCase() ) ); // eslint-disable-line no-console
      // Error means offset is 0 i.e. the word === normal!!
      return 0;
    }
    const offset = lcwHash - fd.lexeme.hash[ word ];
    // Throw error if `offset` is outside the acceptable range.
    if ( offset < 0 || offset > 3 ) throw new Error( 'feature.normal: offset of ' + offset + ' for ' + JSON.stringify( word ) );
    return ( offset );
  }; // normal()

  var tokenType = function ( word ) {
    var cat;
    for ( cat = 0; cat < rgxCatDetectors.length; cat += 1 ) {
      // Test the category of word against the current `cat`egory.
      if ( rgxCatDetectors[ cat ][ 0 ].test( word ) ) return rgxCatDetectors[ cat ][ 1 ];
    }
    console.log( '\x1b[41m%s\x1b[0m has unknown token type! (feature.tokenType)', JSON.stringify( word ) ); // eslint-disable-line no-console
    // Detection failed – assume it to be word!
    return tcat.hash.word;
  }; // tokenType()

  // Compile the required trex.
  for ( i = 0; i < imax; i += 1 ) {
    // Push `[ regex, category ]` pair. This is similar to what is contained in `compile-trex.js` in `wink-nlp`.
    rgxCatDetectors.push( [ ( new RegExp( regexes[ i ][ 0 ], regexes[ i ][ 1 ] ) ), regexes[ i ][ 2 ] ] );
  }
  // Setup `methods`.
  methods.shape = shape;
  methods.suffix = suffix;
  methods.prefix = prefix;
  methods.lexeme = lexeme;
  methods.lexemeCID = lexemeCID;
  methods.isAbbrev = isAbbrev;
  methods.normal = normal;
  methods.tokenType = tokenType;
  methods.pos = partOfSpeech;
  methods.isSPoS = isSPoS;
  methods.lemma = lemma;
  methods.isSLemma = isSLemma;
  methods.lutCase = lutCase;

  return methods;
}; // extract();


module.exports = feature;
