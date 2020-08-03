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

/* eslint-disable no-sync */


var makeRegexes = function ( config ) {
  var rgx = [];
  var imax = config.length;
  var i;

  for ( i = 0; i < imax; i += 1 ) {
    rgx.push( [ ( new RegExp( config[ i ][ 0 ], config[ i ][ 1 ] ) ), config[ i ][ 2 ] ] );
  }
  return rgx;
}; // makeRegexes()

var compileTRex =  function ( trex ) {
  var rtc;
  var ltc;
  var helpers = Object.create( null );

  try {
    rtc = makeRegexes( trex.rtc );

    ltc = makeRegexes( trex.ltc );

    // Helper regexes.
    for ( const h in trex.helpers ) { // eslint-disable-line guard-for-in
      helpers[ h ] = new RegExp( trex.helpers[ h ][ 0 ], trex.helpers[ h ][ 1 ] );
    }

    // file = path.join( __dirname, 'languages', language, 'normalization-map.json' );
    // nmap = JSON.parse( fs.readFileSync( file, 'utf8' ) );
  } catch ( ex ) {
    throw Error( 'wink-nlp: Invalid trex.\n\nDetails:\n' + ex.message );
  }
  return  { rtc: rtc, ltc: ltc, helpers: helpers };
}; // readLangConfig()

module.exports = compileTRex;
