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

/* eslint-disable no-console */
/* eslint-disable no-sync */
/* eslint-disable guard-for-in */

const originalModel = require( './languages/cur/models/eng-core-web-model.json' );

/**
 * Converts `base64` string into an array buffer. It works as a replacement for
 * `Buffer.from( data, 'base64' )` of Node.js and delivers better browser
 * compatibility.
 *
 * @param {string} data  - base64 string of data to be converted
 * @returns {ArrayBuffer} an ArrayBuffer of the data
 */
const bufferFromBase64 = function ( data ) {
  let decodedData;
  // Use a try-catch block to detect if `atob()` is supported.
  try {
    decodedData = atob( data );
  } catch ( e ) {
    throw Error( `Unsupproted browser or node.js version;
      Refer to https://developer.mozilla.org/en-US/docs/Web/API/atob#browser_compatibility for supported versions.` );
  }

  var size = decodedData.length;
  var bytes = new Uint8Array( size );
  for ( let k = 0; k < size; k += 1 ) {
      bytes[ k ] = decodedData.charCodeAt( k );
  }

  return bytes.buffer;
}; // bufferFromBase64()

var readModel = function ( ) {
  // Create a deep clone so that multiple instances of winkNLPs can be created
  // without causing any conflict. The orginal model will in any case stay in
  // the Node.js cache as per the "require" definition.
  const model = JSON.parse( JSON.stringify( originalModel ) );
  // Packing information block.
  var packing = model.packing;
  var featuresData = model.features;
  var pos = model.pos;
  // Read the lexicon & expansions blocks and convert them into `Uint32Array`.
  model.lexicon = new Uint32Array( bufferFromBase64( model.lexicon ) );

  model.xpansions = new Uint32Array( bufferFromBase64( model.xpansions ) );

  // Rebuild hash from list for the required features.
  for ( const f in model.packing.layout ) {
    if ( packing.layout[ f ][ 3 ] === 0 ) {
      featuresData[ f ].hash = Object.create( null );
      for ( let k = 0; k < featuresData[ f ].list.length; k += 1 ) featuresData[ f ].hash[ featuresData[ f ].list[ k ] ] = k;
    }
  }
  // Rebuilding hash from lexeme is mandatory.
  featuresData.lexeme.hash = Object.create( null );
  for ( let k = 0; k < featuresData.lexeme.list.length; k += 1 ) featuresData.lexeme.hash[ featuresData.lexeme.list[ k ] ] = k;


  // Build an array of sets that is indexed by `lexemeCID`; each set contains the
  // possible pos tags for that cluster id.
  const clusters = featuresData.posClusters.list;
  for ( let k = 0; k < clusters.length; k += 1 ) {
    clusters[ k ] = new Set( clusters[ k ].split( '_' ).map( ( e ) => ( pos.hash[ e ] || 0 ) ) );
  }


  return model;
}; // readModel()

module.exports = readModel;
