//     wink-nlp
//     A new way of doing NLP
//
//     Copyright (C) 2017-20  GRAYPE Systems Private Limited
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

var its = require( './its.js' );
var as = require( './as.js' );
var allowed = Object.create( null );

allowed.its4token = new Set( [
  its.case,
  its.uniqueId,
  its.negationFlag,
  its.normal,
  its.contractionFlag,
  its.pos,
  its.precedingSpaces,
  its.prefix,
  its.shape,
  its.stopWordFlag,
  its.abbrevFlag,
  its.suffix,
  its.type,
  its.value
] );

allowed.its4tokens = allowed.its4token;

allowed.its4selTokens = allowed.its4token;

allowed.as4tokens = new Set( [
  as.array,
  as.text,
  as.bow,
  as.freqTable,
  as.bigrams,
  as.unique,
  as.markedUpText
] );

// NOTE: it should exclude `as.markedUpText`, whenever this is included in the above.
allowed.as4selTokens = allowed.as4tokens;

allowed.its4entity = new Set( [
  its.value,
  its.normal,
  its.type,
  its.detail,
  its.span
] );

allowed.as4entities = new Set( [
  as.array,
  as.bow,
  as.freqTable,
  as.unique
] );

allowed.as4selEntities = allowed.as4entities;

allowed.its4sentence = new Set( [
  its.value,
  its.normal,
  its.span,
  its.markedUpText,
  its.negationFlag,
  its.sentiment
] );

allowed.its4document = allowed.its4sentence;


module.exports = allowed;
