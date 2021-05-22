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

var consts = Object.create( null );
// Unknown or the UNK!
consts.UNK = 0;
// Bits reserved for `precedingSpaces`.
consts.bits4PrecedingSpace = 16;
// Bits reserved for `lemma`.
consts.bits4lemma = 20;
// Mask for pos extraction from tokens
consts.posMask = 0x3F00000;
// Mask for preceding spaces.
consts.psMask = 0xFFFF;
// Mask for pointer to normal in `xpansions`.
consts.xnMask = 0x3FFF0000;
// Mask for lemma extraction in case of contractions.
consts.lemmaMask = 0xFFFFF;
// Size of a single token.
consts.tkSize = 4;
// Size of a single expansion.
consts.xpSize = 4; // can't: ca can can MD i.e. expansion, normal, lemma, pos.
// Expansion count mask.
consts.xcMask = 0x1F;
// Bits reserved for point to expansions in `lemma` space.
consts.bits4xpPointer = 14;
// Negation Flag.
consts.negationFlag = Math.pow( 2, 31 );

module.exports = consts;
