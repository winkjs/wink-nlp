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

// ## identifyMarkedArea
/**
 *
 * Identifies the area to be marked within the detected entitity's span, which is
 * extracted as the value.
 *
 * @param {number[]} mark contains the target area to be extracted from within
 *                        the entitity's span, defined as `[ firstIndex, lastIndex ]`.
 * @param {number} length of the entity's span.
 * @return {number[]}     array containing the modifiers for the orginal span.
 * @private
*/
const identifyMarkedArea = function ( mark, length ) {
  // Length Minus 1.
  const lm1 = length - 1;
  let [ firstIndex, lastIndex ] = mark;

  if ( firstIndex < 0 ) firstIndex += length;
  firstIndex = Math.max( firstIndex, 0 );
  if ( firstIndex > lm1 ) firstIndex = 0;

  if ( lastIndex < 0 ) lastIndex += length;
  lastIndex = Math.min( lastIndex, lm1 );
  if ( lastIndex < firstIndex ) lastIndex = lm1;

  // The `lastIndex` manoeuvre is required to keep identical approach
  // being followed in `learnSinglePattern()` of automaton.js, where
  // the `firstIndex` **was** being added and the `lastIndex` **was** being
  // subtracted from the span of entity.
  lastIndex = length - lastIndex - 1;
  return [ firstIndex, lastIndex ];
}; // identifyMarkedArea()

module.exports = identifyMarkedArea;
