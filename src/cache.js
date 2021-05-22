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

var constants = require( './constants.js' );
var xnMask = constants.xnMask;
var bits4PrecedingSpace = constants.bits4PrecedingSpace;
var xcMask = constants.xcMask;
var bits4xpPointer = constants.bits4xpPointer;

// ## cache
/**
 *
 * Creates an instance of `cache`. It is typically instantiated in each `winkNLP`
 * instance and there it is responsible for caching token properties acrosss the
 * documents i.e. the `doc()`.
 *
 * @param {Array} model containing language model.
 * @param {Array} featureFn extracts language specific features of a lexeme.
 * @return {object} of methods.
 * @private
*/
var cache = function ( model, featureFn ) {
  const fTokenType = 'tokenType';
  // Returned!
  var methods = Object.create( null );
  // Extract frequently used properties.
  var lexemesHash = model.features.lexeme.hash;
  var lxm = model.features.lexeme;
  var lexemeIntrinsicSize = model.features.lexeme.intrinsicSize;
  var layout = model.packing.layout;
  var pkSize = model.packing.size;
  var efSize = model.packing.efSize;
  var efList = model.packing.efList;
  var efListSize = efList.length;
  var lexicon = model.lexicon;
  var xpansions = model.xpansions;
  var posClusters = model.features.posClusters.list;
  // Contains quantas of UInt32Array of size `model.packing.size`. A quanta
  // at an `index` contains the features of the corresponding OOV lexeme loacted
  // at `model.features.lexeme.list[ index ]`. This simplifies information access,
  // as it remains identical to the **intrinsic lexicon** with the only difference
  // that this not a continuous array of UInt32s. It follows
  // `[ normal, lemma, <extractable features> ]` structure. The extractable
  // features will be dynamically determined using the language model.
  var extrinsicLexicon = [];
  // Base Packing Size is `2` because one word each for normal & lemma is needed.
  var elBasePackingSize = 2;
  // Packing size for each lexeme in `extrinsicLexicon` — base plus additional
  // words needed for extractable features.
  var elPackingSize = 2 + efSize;
  // Extractable Features temp storage; eventually its contents will be pushed
  // inside `extrinsicLexicon`. Space is allocated right in the beginning to save
  // time. Its contents are filled i.e. initialized with 0 whenever needed.
  var efArray = new Uint32Array( efSize );

  var feature = featureFn( model.packing.config );

  // Extractable Features Hash: used during property extraction for OOV tokens.
  // If a token is not found in this then a **0** is returned.
  var efHash = Object.create( null );
  // Since `tokenType` is determined during tokenization, it is always extractable.
  efHash.tokenType = true;
  // Copy rest from the list in to the hash.
  efList.forEach( ( ef ) => ( efHash[ ef ] = true ) );

  // ## getFeaturesIndex
  /**
   *
   * Returns the `index` of `value` from the feature `name`. If the value is
   * missing then it is added and its `index` is returned accordingly alongwith
   * a flag indicating that it is a new value.
   *
   * @param {string} name of the feature.
   * @param {string} value of the feature, whoes index will be returned.
   * @return {number[]} `[ isNewValue, index ]`.
   * @example
   * // Returns the index (hash) of **lexeme** – `you`:
   * getFeaturesIndex( 'lexeme', 'you' );
   * // -> [ 0, 47 ]
   * // If `you` was absent then it would have been added and the return value
   * // would have been [ 1, index of added value ]
   * @private
  */
  var getFeaturesIndex = function ( name, value ) {
    // Extract the named feature.
    var f = model.features[ name ];
    // And its hash & list.
    var h = f.hash;
    var l = f.list;
    // New `value` flag.
    var isNewValue = 0;
    // Check if `value` is present.
    var index = h[ value ];
    if ( index === undefined ) {
      // Feature's storage limit check. — not required right now!
      // if ( f.index > f.maxIndex ) {
      //   throw Error( `wink-nlp: memory limit for "${name}" exceeded.` );
      // }
      // Missing — add `value`.
      index = h[ value ] = f.index;
      // No need to increment index because push returns the required value!
      f.index = l.push( value );
      // Set new value flag.
      isNewValue = 1;
    }
    return [ isNewValue, index ];
  }; // getFeaturesIndex()

  // ## add
  /**
   *
   * Adds a token in the cache corresponding to the **text**. If the same is
   * present in the cache then a pointer to its cached value is retured; otherwise
   * a new entry is made in the cache and the same is returned.
   *
   * Whenever a new entry is made, all its extractable features are also
   * extracted & packed; and if an extractable feature is also new, its entry
   * is also made via `getFeaturesIndex()` api.
   *
   * @param {string} text i.e. the value of the token to be added.
   * @param {number} category of the token i.e. `word(0)` or `number(1)`, etc.
   * @return {number[]} index (or hash) of the `text` added.
   * @private
  */
  var add = function ( text, category ) {
    // Lowercased `text`.
    var normText = text.toLowerCase();
    // First start with `text` as its properties are being processed first.
    var textIndex = getFeaturesIndex( 'lexeme', text );
    // Then obtain index of its normal.
    var normIndex = ( normText === text ) ? textIndex : getFeaturesIndex( 'lexeme', normText );
    // Helpers: cfg of feature, feature, feature's value, feature's value for
    // packing & loop index.
    var cfg, f, fv, fv4p, k;

    // Process properties of `text` first.
    // The `textIndex[ 0 ]` is a indicated if the value is newly added, and if
    // so then add extract-able features. See `getFeaturesIndex()` above.
    if ( textIndex[ 0 ] ) {
      // NOTE: This block of code is repeated below, with an exception that
      // in the next block we use `normtext` in `fv = feature[ f ]( text )`.
      // Intialize extractable featires' array with all 0s.
      efArray.fill( 0 );
      // For every extractable feature, extract & pack.
      for ( k = 0; k < efListSize; k += 1 ) {
        f = efList[ k ];
        cfg = layout[ f ];
        // Use `text`.
        fv = feature[ f ]( text, category, methods );
        fv4p = ( cfg[ 3 ] ) ? fv : getFeaturesIndex( f, fv )[ 1 ];
        efArray[ cfg[ 0 ] ] |= ( fv4p << cfg[ 2 ] ); // eslint-disable-line no-bitwise
      } // for
      // Pack token type now.
      f = fTokenType;
      cfg = layout[ f ];
      efArray[ cfg[ 0 ] ] |= ( category << cfg[ 2 ] ); // eslint-disable-line no-bitwise
      // Push all the details i.e. `[ normal, lemma, <extractable features> ]`
      // into `extrinsicLexicon`.
      extrinsicLexicon.push( normIndex[ 1 ], normIndex[ 1 ], ...efArray );
    } // if ( >= lexemeIntrinsicSize )

    // If the normalized text is not same as the original text then the
    // normalize text's extract-able features could be candidates for addition.
    if ( textIndex[ 1 ] !== normIndex[ 1 ] ) {
      // Has it been newly added? If Yes, add its extract-able features.
      if ( normIndex[ 0 ] ) {
        // NOTE: This block of code is same as above.
        // Intialize extractable featires' array with all 0s.
        efArray.fill( 0 );
        // For every extractable feature, extract & pack.
        for ( k = 0; k < efListSize; k += 1 ) {
          f = efList[ k ];
          cfg = layout[ f ];
          // Use `normText`.
          fv = feature[ f ]( normText, category, methods );
          fv4p = ( cfg[ 3 ] ) ? fv : getFeaturesIndex( f, fv )[ 1 ];
          efArray[ cfg[ 0 ] ] |= ( fv4p << cfg[ 2 ] ); // eslint-disable-line no-bitwise
        } // for
        // Pack token type now.
        f = fTokenType;
        cfg = layout[ f ];
        efArray[ cfg[ 0 ] ] |= ( category << cfg[ 2 ] ); // eslint-disable-line no-bitwise
        // Push all the details i.e. `[ normal, lemma, <extractable features> ]`
        // into `extrinsicLexicon`.
        extrinsicLexicon.push( normIndex[ 1 ], normIndex[ 1 ], ...efArray );
      } // if ( >= lexemeIntrinsicSize )
    } // if ( textIndex !== normIndex )

    // Return the `textIndex` only – this can be sued to extract properties.
    return ( textIndex[ 1 ] );
  }; // add()

  // ## lookup
  /**
   *
   * Looks up for the `text` in the cache and returns its index. If the input
   * text is a contraction then its expansions are returned.
   *
   * @param {string} text to be searched in the cache.
   * @return {number[]} contains either a single element (i.e. `index`) indicating
   * that it is NOT a contraction or multiple elements indication that the text
   * is a contraction. Each contraction expands into 4 elements viz. `lexeme`,
   * `normal`, `lemma` , and `pos`.
   * @private
  */
  var lookup = function ( text ) {
    // `layout.isContraction` for multiple use later.
    var layout4isContraction = layout.isContraction;
    var layout4lemma = layout.lemma;
    // `index` to `text`.
    var index = lexemesHash[ text ];
    // Holds lemma extracted in case of contraction.
    var lemma;
    // Contraction Count, Contraction Index, Loop Index.
    var cc, cx, cxi;

    // If the text is not found, return `null`.
    if ( index === undefined ) return null;
    // `text` is found – need to check for contraction if `text` is not an OOV.
    var tokens = [];
    var isContraction;
    if ( index < lexemeIntrinsicSize ) {
      // Not an OOV, check it it is a contraction.
      isContraction = ( lexicon[ layout4isContraction[ 0 ] + ( index * pkSize ) ] & layout4isContraction[ 1 ] ) >>> layout4isContraction[ 2 ]; // eslint-disable-line no-bitwise
      if ( isContraction ) {
        // It is a contraction, process its expansions.
        // Start by extracting lemma, as it contains pointer to `expansions` and their count.
        lemma  = ( lexicon[ layout4lemma[ 0 ] + ( index * pkSize ) ] & layout4lemma[ 1 ] ) >>> layout4lemma[ 2 ]; // eslint-disable-line no-bitwise
        // Extract pointer (i.e. index) to expansions and their count.
        cx = lemma & 0x3FFF; // eslint-disable-line no-bitwise
        cc = ( lemma & ( xcMask << bits4xpPointer ) ) >> bits4xpPointer; // eslint-disable-line no-bitwise
        // Iterate through `cc` times to push details into the `tokens`.
        for ( cxi = 0; cxi < cc; cxi += 4 ) {
          tokens.push(
            xpansions[ cx + cxi ],      // lexeme
            cx + cxi + 1,               // normal (pointer to xpansion & not to lexicon)
            xpansions[ cx + cxi + 2 ],  // lemma
            xpansions[ cx + cxi + 3 ]   // pos
          );
        }
      } else {
        // Not a contraction, simply add `text`'s `index` to `tokens`.
        tokens.push( index );
      }
    } else {
      // An OOV, only add `text`'s `index` to `tokens`.
      tokens.push( index );
    }
    return tokens;
  }; // lookup()

  // ## value
  /**
   *
   * Returns the value corresponding to the `index`.
   *
   * @param {number} index for the value.
   * @return {string} value corresponding to the `index`.
   * @private
  */
  var value = function ( index ) {
    return lxm.list[ index ];
  }; // value()

  // ## normal
  /**
   *
   * Returns the index of normal of the input `index` (of required lexeme) after
   * taking into account mapping of spelling, if any.
   *
   * @param {number} index of the required lexeme.
   * @return {string} index to the normal.
   * @private
  */
  var normal = function ( index ) {
    // Temps for `layput.normal`, `layout.isSpellingMapped`, etc.
    var layout4normal = layout.normal;
    var layout4mapped = layout.isSpellingMapped;
    var layout4lemma =  layout.lemma;
    // Used to remap if its value is `1`. In this case lemma becomes the `normIndex`.
    var isSpellingMapped;
    // Index for OOVs i.e. when `index > lexemeIntrinsicSize`.
    var oovIdx;
    // Returned: normal's index.
    var normIndex;

    // Processing is different for native and OOV words or lexemes. For OOVs
    // properties have to be extracted from `extrinsicLexicon`, whereas for
    // native words they are exracted from `lexicon`.
    if ( index < lexemeIntrinsicSize ) {
      normIndex = ( lexicon[ layout4normal[ 0 ] + ( index * pkSize ) ] & layout4normal[ 1 ] ) >>> layout4normal[ 2 ]; // eslint-disable-line no-bitwise
      isSpellingMapped = ( lexicon[ layout4mapped[ 0 ] + ( index * pkSize ) ] & layout4mapped[ 1 ] ) >>> layout4mapped[ 2 ]; // eslint-disable-line no-bitwise
      if ( isSpellingMapped ) {
        // Mapped, pick up the lemma portion as this points to normal in case of
        // mapped spellings.
        normIndex = ( lexicon[ layout4lemma[ 0 ] + ( index * pkSize ) ] & layout4lemma[ 1 ] ) >>> layout4lemma[ 2 ]; // eslint-disable-line no-bitwise
      } else {
        // Compute actual index from the relative index.
        normIndex += index;
      }
    } else {
      oovIdx = index - lexemeIntrinsicSize;
      // Refer to `extrinsicLexicon` structure at the top of `cache()`.
      normIndex = extrinsicLexicon[ oovIdx * elPackingSize ];
      // This `normIndex` may point to an intrinsic lexeme, in which case
      // mapping needs to be checked.
      if ( normIndex < lexemeIntrinsicSize ) {
        isSpellingMapped = ( lexicon[ layout4mapped[ 0 ] + ( normIndex * pkSize ) ] & layout4mapped[ 1 ] ) >>> layout4mapped[ 2 ]; // eslint-disable-line no-bitwise
        if ( isSpellingMapped ) {
          normIndex = ( lexicon[ layout4lemma[ 0 ] + ( normIndex * pkSize ) ] & layout4lemma[ 1 ] ) >>> layout4lemma[ 2 ]; // eslint-disable-line no-bitwise
        }
      }
    }

    return normIndex;
  }; // normal()

  // ## mappedSpelling
  /**
   *
   * Returns the index of mapped spelling's of the input `index` of required lexeme.
   *
   * @param {number} index of the required lexeme.
   * @return {string} index to the normal.
   * @private
  */
  var mappedSpelling = function ( index ) {
    // Temps for `layout.isSpellingMapped`, etc.
    var layout4mapped = layout.isSpellingMapped;
    var layout4lemma =  layout.lemma;
    // Used to remap if its value is `1`. In this case lemma becomes the `normIndex`.
    var isSpellingMapped;
    // Returned: normal's index.
    var mappedIndex = index;

    // Only applicable to lexems that are inside the vocabulary as there can not
    // be mapped spelling for OOV words!
    if ( index < lexemeIntrinsicSize ) {
      isSpellingMapped = ( lexicon[ layout4mapped[ 0 ] + ( index * pkSize ) ] & layout4mapped[ 1 ] ) >>> layout4mapped[ 2 ]; // eslint-disable-line no-bitwise
      if ( isSpellingMapped ) {
        // Mapped, pick up the lemma portion as this points to normal in case of
        // mapped spellings.
        mappedIndex = ( lexicon[ layout4lemma[ 0 ] + ( index * pkSize ) ] & layout4lemma[ 1 ] ) >>> layout4lemma[ 2 ]; // eslint-disable-line no-bitwise
      }
    }

    return mappedIndex;
  }; // mappedSpelling()

  // ## nox
  /**
   *
   * Returns the index of normal of the expansion.
   *
   * @param {number} binaryWord containing pointer to `xpansions` and `precedingSpaces`;
   * It is the 2nd (relative) element of a single token's packet of 4-words.
   * @return {number} index to the normal, whoes value can be found via `value()`.
   * @private
  */
  var nox = function ( binaryWord ) {
    return xpansions[ ( binaryWord & xnMask) >>> bits4PrecedingSpace ];  // eslint-disable-line no-bitwise
  }; // nox()

  // ## property
  /**
   *
   * Extracts the property – `prop` of a lexeme (or word) specified by `index`.
   *
   * @param {number} index of the lexeme whoes properties are required to be extracted.
   * @param {string} prop (name) that needs to be extracted — it should be a valid property.
   * @return {string} extracted property, if `prop` is known/valid otherwise `null`.
   * @private
  */
  var property = function ( index, prop ) {
    // A property and its value
    var propValue;
    // Index for OOVs i.e. when `index > lexemeIntrinsicSize`.
    var oovIdx;
    // Temp for `layput[ p ]`
    var layout4Prop;

    // Processing is different for native and OOV words or lexemes. For OOVs
    // properties have to be extracted from `extrinsicLexicon`, whereas for
    // native words they are exracted from `lexicon`.
    if ( index < lexemeIntrinsicSize ) {
      layout4Prop = layout[ prop ];
      if ( layout4Prop  === undefined ) return null;
      propValue  = ( lexicon[ layout4Prop[ 0 ] + ( index * pkSize ) ] & layout4Prop[ 1 ] ) >>> layout4Prop[ 2 ]; // eslint-disable-line no-bitwise
      // Use hash/list to update value if required.
      if ( layout4Prop[ 3 ] === 0 || layout4Prop[ 5 ] === 1 ) propValue = model.features[ prop ].list[ propValue ];
    } else {
        // Attempt extraction only if extractable!
        if ( !efHash[ prop ] ) return 0;
        // Compute index into `extrinsicLexicon`.
        oovIdx = index - lexemeIntrinsicSize;
        layout4Prop = layout[ prop ];
        // No need for this check as `if ( !efHash[ prop ] )...` ensures return
        // in case of any unknown property:
        /* if ( layout4Prop  === undefined ) return null; */
        // Use `extrinsicLexicon`.

        // Reach to the desired quanta via `oovIdx * elPackingSize`, move forward by `base size` and then go to offset!
        propValue  = ( extrinsicLexicon[ ( oovIdx * elPackingSize ) + elBasePackingSize + layout4Prop[ 0 ] ] & layout4Prop[ 1 ] ) >>> layout4Prop[ 2 ]; // eslint-disable-line no-bitwise
        // Use hash/list to update value if required.
        if ( layout4Prop[ 3 ] === 0 || layout4Prop[ 5 ] === 1 ) propValue = model.features[ prop ].list[ propValue ];
    }
    return propValue;
  }; // property()

  var isMemberPOS = function ( lexemeIdx, posIdx ) {
    // Dont miss converting posIdx to a number.
    return posClusters[ property( lexemeIdx, 'lexemeCID' ) ].has( +posIdx );
  }; // isMemberPOS()

  // ## posOf
  /**
   *
   * Extracts the pos' index of the a lexeme (or word) specified by `index`.
   *
   * @param {number} index of the lexeme whoes properties are required to be extracted.
   * @return {string[]} extracted properties in the same sequence as `list`.
   * @private
  */
  var posOf = function ( index ) {
    // Value of extracted pos will go here.
    var posValue;
    // Index for OOVs i.e. when `index > lexemeIntrinsicSize`.
    var oovIdx;
    // Temp for `layput[ p ]`
    var layout4Prop;

    // Processing is different for native and OOV words or lexemes. For OOVs
    // properties have to be extracted from `extrinsicLexicon`, whereas for
    // native words they are exracted from `lexicon`.
    if ( index < lexemeIntrinsicSize ) {
        layout4Prop = layout.pos;
        posValue  = ( lexicon[ layout4Prop[ 0 ] + ( index * pkSize ) ] & layout4Prop[ 1 ] ) >>> layout4Prop[ 2 ]; // eslint-disable-line no-bitwise
    } else {
        // Compute index into `extrinsicLexicon`.
        oovIdx = index - lexemeIntrinsicSize;
        layout4Prop = layout.pos;

        // Use `extrinsicLexicon`.
        // Reach to the desired quanta via `oovIdx * elPackingSize`, move forward by `base size` and then go to offset!
        posValue  = ( extrinsicLexicon[ ( oovIdx * elPackingSize ) + elBasePackingSize + layout4Prop[ 0 ] ] & layout4Prop[ 1 ] ) >>> layout4Prop[ 2 ]; // eslint-disable-line no-bitwise
    }
    return posValue;
  }; // posOf()

  // ## valueOf
  /**
   *
   * Extracts the value of the `prop`erty for its input `index`.
   *
   * @param {string} prop to be extracted for the `index`.
   * @param {number} index of the property.
   * @return {string[]} extracted properties in the same sequence as `list`.
   * @private
  */
  var valueOf = function ( prop, index ) {
    return model.features[ prop ].list[ index ];
  }; // valueOf()

  // ## currentSize
  /**
   *
   * Returns the current size of lexicon including OOVs.
   *
   * @return {number} size of the current lexicon.
   * @private
  */
  var currentSize = function () {
    // Minus `1` becuase at `0` we have OOV symbolic word.
    return ( lxm.list.length - 1 );
  }; // size()

  // ## intrinsicSize
  /**
   *
   * Returns the intrinsic i.e. native size of lexicon.
   *
   * @return {number} size of the native or intrinsic lexicon.
   * @private
  */
  var intrinsicSize = function () {
    return lexemeIntrinsicSize;
  };

  /**
   * Finds if the text can have `pos` as valid part of speech, provided it is a
   * base form. Used in **lemmatization** to see if the lemma shares the same pos
   * with the original word.
   *
   * @param  {string} text  the incoming word.
   * @param  {string} pos   the pos that needs to be checked as one of the valid pos for text.
   * @return {boolean}       True if it does, otherwise false.
   */
  var hasSamePOS = function ( text, pos ) {
    // Get the word's index
    var textIndex = lookup( text );
    // If not found i.e. OOV means that it did not have a pre-defined POS set.
    if ( !textIndex ) return false;
    // More then one means it is a contraction.
    if ( textIndex.length > 1 ) return false;
    // Outside intrinsic vocab means OOV again.
    if ( textIndex[ 0 ] >= lexemeIntrinsicSize ) return false;
    // If it is not a base form so point in checking same POS — basics of
    // lemmatization. For example, `hiding` becomes `hid` on removal of `-ing`,
    // which is not in base form (i.e. hid is the past tense of hide); so it should
    // not take that as the lemma and instead try adding `-e`.
    if ( property( textIndex, 'isBaseForm' ) === 0 ) return false;
    // Finally if it is in base form then check for pos membership.
    return isMemberPOS( textIndex[ 0 ], model.pos.hash[ pos ] );
  }; // hasSamePOS()

  // ## isOOV
  /**
   *
   * Tests the input `text` for being an OOV.
   *
   * @param {text} text that needs to be test for OOV.
   * @return {boolean} true if OOV otherwise false (in vocab).
   * @private
  */
  var isOOV = function ( text ) {
    var textIndex = lookup( text );
    if ( !textIndex ) return true;
    if ( textIndex.length > 1 ) return false;
    if ( textIndex[ 0 ] >= lexemeIntrinsicSize ) return true;
    return false;
  }; // isOOV()

  methods.add = add;
  methods.lookup = lookup;
  methods.value = value;
  methods.property = property;
  methods.normal = normal;
  methods.nox = nox;
  methods.posOf = posOf;
  methods.valueOf = valueOf;
  methods.currentSize = currentSize;
  methods.intrinsicSize = intrinsicSize;
  methods.isOOV = isOOV;
  methods.isMemberPOS = isMemberPOS;
  methods.hasSamePOS = hasSamePOS;
  methods.mappedSpelling = mappedSpelling;

  return methods;
}; // cache()

module.exports = cache;
