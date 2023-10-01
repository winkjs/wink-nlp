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

var readModel = require( './read-core-model.js' );

var loadModel = function () {
  var model = readModel( );
  // Capture intrinsic size of chosen features i.e. the ones that have
  // `model.packing.layout[ f ][ 3 ]` set to `0`. Also initialize their
  // index, required for new value addition. The access methods differ
  // if indexes > intrinsic size of a feature.
  // ALSO build the efList here itself.
  model.packing.efList = [];
  for ( const f in model.packing.layout ) { // eslint-disable-line guard-for-in
    // Capture intrinsic size.
    if ( model.packing.layout[ f ][ 3 ] === 0 ) {
      model.features[ f ].intrinsicSize = model.features[ f ].list.length;
      model.features[ f ].index = model.features[ f ].list.length;
      model.features[ f ].maxIndex = ( model.packing.layout[ f ][ 1 ] >>> model.packing.layout[ f ][ 2 ] ); // eslint-disable-line no-bitwise
    }
    // Build the efList.
    if ( model.packing.layout[ f ][ 4 ] === 1 ) {
      model.packing.efList.push( f );
    }
  }
  // Finally the `lexeme` as it is not really counted as a feature.
  model.features.lexeme.intrinsicSize = model.features.lexeme.list.length;
  model.features.lexeme.index = model.features.lexeme.list.length;

  return model;
};

module.exports = loadModel;
