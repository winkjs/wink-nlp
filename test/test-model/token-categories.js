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

const tcat = Object.create( null );
tcat.hash = Object.create( null );

tcat.list = [
  'unk',          // 0
  'word',         // 1
  'number',       // 2
  'url',          // 3
  'email',        // 4
  'mention',      // 5
  'hashtag',      // 6
  'emoji',        // 7
  'emoticon',     // 8
  'time',         // 9
  'ordinal',      // 10
  'currency',     // 11
  'punctuation',  // 12
  'symbol',       // 13
  'tabCRLF',      // 14
  'wordRP',       // 15 – word with Right Punctuation
  'alpha',        // 16 – pure alphabets
  'apos',         // 17
  'decade',       // 18 – 1990s kind
  'shortForm'     // 19 – Initialism, where each letter is separated by a period
];

tcat.hash.unk = 0;
tcat.hash.word = 1;
tcat.hash.number = 2;
tcat.hash.url = 3;
tcat.hash.email = 4;
tcat.hash.mention = 5;
tcat.hash.hashtag = 6;
tcat.hash.emoji = 7;
tcat.hash.emoticon = 8;
tcat.hash.time = 9;
tcat.hash.ordinal = 10;
tcat.hash.currency = 11;
tcat.hash.punctuation = 12;
tcat.hash.symbol = 13;
tcat.hash.tabCRLF = 14;
tcat.hash.wordRP = 15;
tcat.hash.alpha = 16;
tcat.hash.apos = 17;
tcat.hash.decade = 18;
tcat.hash.shortForm = 19;

module.exports = tcat;
