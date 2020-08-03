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

const num = [
   '1', '11', '111', '1111',
   '1-', '11-', '1-1', '11-1', '1-11', '111-', '1-111', '11-11', '111-1', '111-',
   '1–', '11–', '1–1', '11–1', '1–11', '111–', '1–111', '11–11', '111–1', '111–'
 ];
const mapAlpha = {
  0: 'a',
  1: 'Z'
};
const tokens = {};
for ( let i = 0; i < 16; i += 1 ) {
  for ( let j = 0; j < num.length; j += 1 ) {
    for ( let k = 0; k < 16; k += 1 ) {
      const tk = i.toString( 2 ).padStart( 6,'0' ).slice( -4 ).split( '' ).map( ( e ) => ( mapAlpha[ e ] ) ).join( '' );
      const ti = i.toString( 2 ).padStart( 6,'0' ).slice( -4 ).split( '' ).map( ( e ) => ( mapAlpha[ e ] ) ).join( '' );
      tokens[ ti + num[ j ] ] = true;
      tokens[ ti + num[ j ] + tk ] = true;
    }
  }
}

const sentence = Object.keys( tokens ).join( ' ' );

module.exports = sentence;
